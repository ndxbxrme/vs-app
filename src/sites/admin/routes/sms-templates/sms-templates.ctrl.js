import './sms-templates.styl'
angular.module('vs-admin')
.directive('smsTemplates', function($http, $timeout, $state, env, alert) {
  return {
    template: require('./sms-templates.html').default,
    scope: {},
    link: (scope) => {
    }
  }
});