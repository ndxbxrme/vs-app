import './epc.styl'
angular.module('vs-admin')
.directive('adminEpc', function($http, $timeout, $state, env, alert) {
  return {
    template: require('./epc.html').default,
    scope: {},
    link: (scope) => {

    }
  }
});