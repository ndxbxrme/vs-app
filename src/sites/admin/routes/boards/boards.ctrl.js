import './boards.styl'
angular.module('vs-admin')
.directive('adminBoards', function($http, $timeout, $state, env, alert) {
  return {
    template: require('./boards.html').default,
    scope: {},
    link: (scope) => {

    }
  }
});