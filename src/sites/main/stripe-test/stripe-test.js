angular.module('vs-app')
.directive('stripeTest', function($http, $stateParams, $timeout, $state) {
  return {
    template: require('./stripe-test.html').default,
    scope: {},
    link: function(scope, elem) {
        scope.payments = [];
        scope.loading = false;
        scope.error = null;
        scope.nextCursor = null;

        scope.loadPayments = function(cursor) {
            scope.loading = true;
            scope.error = null;


            const siteName = 'main';
            const endpoint = 'stripe-payments';
            const config = {headers:{Authorization:'Bearer ' + (endpoint.route ? $http.propertyToken : $http.sites[siteName].token)}};
            return $http.get((endpoint.route || ($http.sites[siteName].url + "/api/" + endpoint)), config).then(function(response) {
                var result = response.data;

                scope.payments = cursor
                    ? scope.payments.concat(result.data)
                    : result.data;

                scope.nextCursor = result.next_cursor;
            }).catch(function() {
                scope.error = 'Unable to load payments';
            }).finally(function() {
                scope.loading = false;
            });
        }


        scope.formatAmount = function(amount) {
            return (amount / 100).toLocaleString('en-GB', {
            style: 'currency',
            currency: 'GBP'
            });
        };

        scope.loadPayments();
    }
  }
})
.config(($stateProvider) => {
  $stateProvider.state('stripe-test', {
    url: '/stripe-test',
    template: '<stripe-test></stripe-test>',
    data: {title: 'Stripe test'}
  });
});