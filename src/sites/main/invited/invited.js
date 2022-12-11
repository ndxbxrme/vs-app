const bcrypt = require('bcrypt-nodejs');
angular.module('vs-app')
.directive('invited', function($http, $stateParams, $timeout) {
  return {
    template: require('./invited.html').default,
    scope: {},
    link: async function(scope, elem) {
      scope.user = (await $http.post($http.sites['main'].url + '/api/user-code', {code:$stateParams.code}, $http.sites['main'].config)).data.items[0];
      if(scope.user) {
        scope.loaded = true;
        scope.codeGood = user.item;
      }
      scope.submit = () => {
        scope.submitted = true;
        if(scope.myform.isValid() && scope.codeGood && scope.password && (scope.password===scope.repeatPassword)) {
          scope.user.item.local.password = bcrypt.hashSync(scope.password, bcrypt.genSaltSync(8), null);
          delete scope.user.code;
          await $http.post($http.sites['main'].url + '/api/complete-registration', {user:scope.user});
          //scope.user.save();
        }
      };
    }
  }
})
.config(($stateProvider) => {
  $stateProvider.state('invited', {
    url: '/invited/:code',
    template: '<invited></invited>',
    data: {title: 'Invited'}
  });
});