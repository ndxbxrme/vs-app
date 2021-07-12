// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-lettings').controller('lettingsForgotCtrl', function($scope, $http, $state, $stateParams) {
    $scope.token = $stateParams.token;
    $scope.newUser = {};
    $scope.forgotUser = {};
    $scope.myForm = {};
    $scope.repeatPassword = '';
    $scope.submitEmail = function() {
      $scope.submitted = true;
      if ($scope.myForm.$valid) {
        return $http.post('/get-forgot-code', {
          email: $scope.forgotUser.item.email
        }, $http.sites["lettings"].config).then(function(response) {
          return $scope.codeRequested = true;
        });
      }
    };
    return $scope.submitPass = function() {
      console.log('submit', $scope.repeatPassword, $scope.newUser.local.password, $scope.myForm.$valid);
      $scope.submitted = true;
      if ($scope.myForm.$valid) {
        console.log('valid');
        if ($scope.repeatPassword === $scope.newUser.local.password) {
          console.log('passwords match');
          return $http.post(`/forgot-update/${$scope.token}`, {
            password: $scope.newUser.local.password
          }, $http.sites["lettings"].config).then(function(response) {
            if (response.data === 'OK') {
              return $state.go('dashboard');
            }
          }, function(err) {
            return false;
          });
        } else {
          return $scope.error = 'Passwords must match';
        }
      }
    };
  });

}).call(this);
