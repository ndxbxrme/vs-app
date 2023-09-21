import './misdescriptions.styl'
angular.module('vs-admin')
.directive('adminMisdescriptions', function($http, $timeout, $state, env, alert) {
  return {
    template: require('./misdescriptions.html').default,
    scope: {},
    link: (scope) => {

    }
  }
});