import './letter-templates.styl'
angular.module('vs-admin')
.directive('letterTemplates', function($http, $timeout, $state, env, alert) {
  return {
    template: require('./letter-templates.html').default,
    scope: {},
    link: (scope) => {
    }
  }
});