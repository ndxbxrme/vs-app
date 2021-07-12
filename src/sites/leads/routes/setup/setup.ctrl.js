// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-leads').controller('leadsSetupCtrl', function($scope, $http, alert) {
    $scope.users = $scope.list('leads:users');
    $scope.emailTemplates = $scope.list('leads:emailtemplates');
    $scope.addUser = function() {
      $scope.newUser.roles = {};
      $scope.newUser.roles[$scope.newUser.role] = {};
      delete $scope.newUser.role;
      $http.post($http.sites["leads"].url + '/api/get-invite-code', $scope.newUser, $http.sites["leads"].config).then(function(response) {
        $scope.inviteUrl = response.data;
        return alert.log('Invite sent');
      }, function(err) {
        return $scope.inviteError = err.data;
      });
      return $scope.newUser = {
        role: 'agency'
      };
    };
    return $scope.copyInviteToClipboard = function() {
      $('.invite-url input').select();
      alert.log('Copied to clipboard');
      return document.execCommand('copy');
    };
  });

}).call(this);
