import './payments.styl';

angular.module('vs-admin')
.directive('adminPayments', function($http) {
  return {
    template: require('./payments.html').default,
    scope: {},
    link: function(scope) {
      scope.payments = [];
      scope.paymentPages = {};
      scope.pageCursors = {
        1: null
      };
      scope.pagination = {
        page: 1,
        pageSize: 20,
        total: 0
      };
      scope.filters = {
        purpose: '',
        status: 'all'
      };
      scope.paymentPurposes = [];
      scope.totalCount = null;
      scope.totalCountIsMinimum = false;
      scope.showingFrom = 0;
      scope.showingTo = 0;
      scope.activePage = 1;
      scope.loading = false;
      scope.error = null;
      scope.loadPayments = function(cursor, page) {
        const siteName = 'main';
        const endpoint = 'stripe-payments';
        const targetPage = page || 1;
        const config = {
          headers: {
            Authorization: 'Bearer ' + $http.sites[siteName].token
          },
          params: {
            limit: scope.pagination.pageSize,
            status: scope.filters.status
          }
        };
        if (cursor) {
          config.params.starting_after = cursor;
        }
        if (scope.filters.purpose) {
          config.params.purpose = scope.filters.purpose;
        }
        if (targetPage === 1) {
          config.params.include_total = true;
        }
        scope.loading = true;
        scope.error = null;
        return $http.get($http.sites[siteName].url + '/api/' + endpoint, config).then(function(response) {
          const result = response.data;
          const responsePayments = result.data || [];
          const filteredPayments = responsePayments.filter(scope.matchesActiveFilters);
          const pageChunks = [];
          for (let index = 0; index < filteredPayments.length; index += scope.pagination.pageSize) {
            pageChunks.push(filteredPayments.slice(index, index + scope.pagination.pageSize));
          }
          if (!pageChunks.length) {
            pageChunks.push([]);
          }
          pageChunks.forEach(function(pagePayments, index) {
            pagePayments.forEach(function(payment) {
              payment.expanded = false;
            });
            if (pagePayments.length) {
              pagePayments[0].expanded = true;
            }
            scope.paymentPages[targetPage + index] = pagePayments;
          });
          const lastPage = targetPage + pageChunks.length - 1;
          scope.pageCursors[lastPage + 1] = result.next_cursor;
          scope.payments = pageChunks[0];
          scope.activePage = targetPage;
          scope.showingFrom = scope.payments.length ? (targetPage - 1) * scope.pagination.pageSize + 1 : 0;
          scope.showingTo = scope.showingFrom ? scope.showingFrom + scope.payments.length - 1 : 0;
          responsePayments.forEach(function(payment) {
            const purpose = scope.getMetadataPurpose(payment);
            if (purpose && scope.paymentPurposes.indexOf(purpose) === -1) {
              scope.paymentPurposes.push(purpose);
            }
          });
          (result.purpose_options || []).forEach(function(purpose) {
            if (scope.paymentPurposes.indexOf(purpose) === -1) {
              scope.paymentPurposes.push(purpose);
            }
          });
          scope.paymentPurposes.sort();
          scope.pagination.total = result.next_cursor ? lastPage * scope.pagination.pageSize + 1 : (targetPage - 1) * scope.pagination.pageSize + filteredPayments.length;
          if (typeof result.total_count === 'number') {
            scope.totalCount = result.total_count;
            scope.totalCountIsMinimum = false;
          } else if (targetPage === 1) {
            scope.totalCount = result.next_cursor ? filteredPayments.length + 1 : filteredPayments.length;
            scope.totalCountIsMinimum = Boolean(result.next_cursor);
          }
        }).catch(function() {
          scope.error = 'Unable to load payments';
          if (targetPage !== scope.activePage) {
            scope.pagination.page = scope.activePage;
          }
        }).finally(function() {
          scope.loading = false;
        });
      };
      scope.formatAmount = function(amount) {
        return (amount / 100).toLocaleString('en-GB', {
          style: 'currency',
          currency: 'GBP'
        });
      };
      scope.getPaymentPurpose = function(payment) {
        const metadataPurpose = scope.getMetadataPurpose(payment);
        if (metadataPurpose) {
          return metadataPurpose;
        }
        if (scope.getStatusClass(payment.status) === 'unsuccessful') {
          return '';
        }
        return payment.description || 'Card payment';
      };
      scope.getMetadataPurpose = function(payment) {
        const metadata = payment.metadata || {};
        return metadata['Payment For'] || metadata.paymentPurpose || '';
      };
      scope.getCustomerName = function(payment) {
        const metadata = payment.metadata || {};
        return metadata['Customer Name'] || payment.customerName || 'Unknown customer';
      };
      scope.getPropertyAddress = function(payment) {
        const metadata = payment.metadata || {};
        return metadata['VitalSpace Property Address'] || metadata['VitalSpace Property Address (EPC)'] || metadata.propertyAddress || '';
      };
      scope.matchesActiveFilters = function(payment) {
        if (
          scope.filters.status === 'successful' &&
          payment.status !== 'succeeded'
        ) {
          return false;
        }
        if (
          scope.filters.status === 'failed' &&
          payment.status === 'succeeded'
        ) {
          return false;
        }
        return !scope.filters.purpose || scope.getMetadataPurpose(payment) === scope.filters.purpose;
      };
      scope.formatStatus = function(status) {
        const statuses = {
          succeeded: 'Payment successful',
          processing: 'Payment processing',
          requires_payment_method: 'Payment unsuccessful',
          requires_action: 'Action required',
          canceled: 'Payment cancelled'
        };
        return statuses[status] || status.replace(/_/g, ' ');
      };
      scope.getStatusClass = function(status) {
        if (status === 'succeeded') {
          return 'successful';
        }
        if (status === 'processing') {
          return 'processing';
        }
        return 'unsuccessful';
      };
      scope.getCardBrandKey = function(brand) {
        const brandKey = (brand || '').toLowerCase();
        const aliases = {
          american_express: 'amex',
          diners: 'diners_club'
        };

        return aliases[brandKey] || brandKey || 'generic';
      };
      scope.getCardBrandIcon = function(brand) {
        const icons = {
          visa: 'fa-brands fa-cc-visa',
          mastercard: 'fa-brands fa-cc-mastercard',
          amex: 'fa-brands fa-cc-amex',
          discover: 'fa-brands fa-cc-discover',
          diners_club: 'fa-brands fa-cc-diners-club',
          jcb: 'fa-brands fa-cc-jcb'
        };
        return icons[scope.getCardBrandKey(brand)] || 'fa-light fa-credit-card';
      };
      scope.togglePayment = function(payment) {
        const expanded = !payment.expanded;
        scope.payments.forEach(function(item) {
          item.expanded = false;
        });
        payment.expanded = expanded;
      };
      scope.applyFilters = function() {
        scope.paymentPages = {};
        scope.pageCursors = {
          1: null
        };
        scope.pagination.page = 1;
        scope.pagination.total = 0;
        scope.activePage = 1;
        scope.payments = [];
        scope.showingFrom = 0;
        scope.showingTo = 0;
        scope.totalCount = null;
        scope.totalCountIsMinimum = false;
        scope.loadPayments(null, 1);
      };
      scope.setStatusFilter = function(status) {
        if (scope.filters.status === status) {
          return;
        }
        scope.filters.status = status;
        scope.applyFilters();
      };
      scope.$watch('pagination.page', function(page) {
        if (!page || page === scope.activePage) {
          return;
        }
        if (scope.loading) {
          scope.pagination.page = scope.activePage;
          return;
        }
        if (scope.paymentPages[page]) {
          scope.payments = scope.paymentPages[page];
          scope.activePage = page;
          return;
        }
        if (scope.pageCursors[page]) {
          scope.loadPayments(scope.pageCursors[page], page);
          return;
        }
        scope.pagination.page = scope.activePage;
      });
      scope.loadPayments(null, 1);
    }
  };
});
