const https = require('https');
module.exports = (ndx) => {
    function fetchStripePayments(startingAfter) {
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams({
                limit: '50',
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
    ndx.app.get('/api/stripe-payments', ndx.authenticate(), async (req, res) => {
        try {
            const cursor = req.query.starting_after;

            if (cursor && (
                typeof cursor !== 'string' ||
                !/^pi_[a-zA-Z0-9]+$/.test(cursor)
            )) {
                return res.status(400).json({ error: 'Invalid cursor' });
            }

            const result = await fetchStripePayments(cursor);

            const payments = result.data.map(payment => {
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
                    metadata: payment.metadata
                };
            });

            res.json({
                data: payments,
                has_more: result.has_more,
                next_cursor: result.has_more && result.data.length
                    ? result.data[result.data.length - 1].id
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