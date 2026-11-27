const https = require('https');
module.exports = (ndx) => {
    function fetchStripePayments(startingAfter, limit) {
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams({
                limit: String(limit || 100),
                'expand[]': 'data.latest_charge'
            });

            if (startingAfter) {
                params.set('starting_after', startingAfter);
            }

            const options = {
                hostname: 'api.stripe.com',
                path: '/v1/payment_intents?' + params.toString(),
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + process.env.STRIPE_KEY
                },
                timeout: 10000
            };

            const req = https.request(options, res => {
            let body = '';

            res.on('data', chunk => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const result = JSON.parse(body);

                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        return reject(
                        new Error(result.error.message || 'Stripe error')
                        );
                    }

                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            });
            });

            req.on('timeout', () => {
                req.destroy(new Error('Stripe request timed out'));
            });

            req.on('error', reject);
            req.end();
        });
    }

    function mapPayment(payment) {
        const charge = payment.latest_charge;
        const chargeData = charge && typeof charge === 'object'
            ? charge
            : null;

        const card = chargeData &&
            chargeData.payment_method_details &&
            chargeData.payment_method_details.card;

        return {
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            description: payment.description,
            created: payment.created,
            customerName: chargeData &&
            chargeData.billing_details &&
            chargeData.billing_details.name,
            cardBrand: card && card.brand,
            cardLast4: card && card.last4,
            metadata: payment.metadata || {}
        };
    }

    function getPaymentPurpose(payment) {
        return payment.metadata['Payment For']
            || payment.metadata.paymentPurpose
            || '';
    }

    function matchesFilters(payment, status, purpose) {
        if (status === 'successful' && payment.status !== 'succeeded') {
            return false;
        }

        if (status === 'failed' && payment.status === 'succeeded') {
            return false;
        }

        return !purpose || getPaymentPurpose(payment) === purpose;
    }

    ndx.app.get('/api/stripe-payments', ndx.authenticate(), async (req, res) => {
        try {
            const cursor = req.query.starting_after;
            const status = req.query.status || 'all';
            const purpose = req.query.purpose || '';
            const pageSize = Number.parseInt(req.query.limit, 10) || 20;
            const includeTotal = req.query.include_total === 'true';

            if (cursor && (
                typeof cursor !== 'string' ||
                !/^pi_[a-zA-Z0-9]+$/.test(cursor)
            )) {
                return res.status(400).json({ error: 'Invalid cursor' });
            }

            if (!['all', 'successful', 'failed'].includes(status)) {
                return res.status(400).json({ error: 'Invalid payment status' });
            }

            if (
                pageSize < 1 ||
                pageSize > 100 ||
                typeof purpose !== 'string' ||
                purpose.length > 200
            ) {
                return res.status(400).json({ error: 'Invalid payment filters' });
            }

            const payments = [];
            const purposes = new Set();
            let scanCursor = cursor;
            let hasMore = true;
            let batches = 0;

            while (
                (includeTotal || payments.length <= pageSize) &&
                hasMore &&
                batches < 100
            ) {
                const result = await fetchStripePayments(scanCursor, 100);
                const batch = result.data.map(mapPayment);

                batches += 1;
                batch.forEach(payment => {
                    const paymentPurpose = getPaymentPurpose(payment);

                    if (paymentPurpose) {
                        purposes.add(paymentPurpose);
                    }
                });

                for (const payment of batch) {
                    if (matchesFilters(payment, status, purpose)) {
                        payments.push(payment);
                    }

                    if (!includeTotal && payments.length > pageSize) {
                        break;
                    }
                }

                if (!includeTotal && payments.length > pageSize) {
                    break;
                }

                hasMore = Boolean(result.has_more);

                if (!result.data.length) {
                    hasMore = false;
                    break;
                }

                scanCursor = result.data[result.data.length - 1].id;
            }

            const pagePayments = payments.slice(0, pageSize);
            const nextCursor = payments.length > pageSize
                ? pagePayments[pagePayments.length - 1].id
                : hasMore
                    ? scanCursor
                    : null;

            res.json({
                data: pagePayments,
                has_more: Boolean(nextCursor),
                next_cursor: nextCursor,
                purpose_options: Array.from(purposes).sort(),
                total_count: includeTotal && !hasMore
                    ? payments.length
                    : null
            });
        } catch (err) {
            console.error('Stripe payments request failed:', err.message);
            res.status(502).json({
                error: 'Unable to retrieve Stripe payments'
            });
        }
    });
};