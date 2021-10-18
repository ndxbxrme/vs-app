// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').controller('maintenance_leadsInvitedCtrl', function($scope, $state, $stateParams, $http) {
    var code;
    code = $stateParams.code;
    return $scope.acceptInvite = function() {
      if ($scope.repeatPassword === $scope.newUser.local.password) {
        return $http.post('/invite/accept', {
          code: decodeURIComponent(code),
          user: $scope.newUser
        }, $http.sites["maintenance_leads"].config).then(function(response) {
          if (response.data === 'OK') {
            return $scope.auth.logOut().then(function() {
              return $state.go('dashboard');
            }, function(err) {
              return false;
            });
          }
        }, function(err) {
          return false;
        });
      } else {
        return $scope.error = 'Passwords must match';
      }
    };
  });

}).call(this);
