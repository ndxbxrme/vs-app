// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-agency').controller('agencyProfileCtrl', function($scope, Auth) {
    return $scope.profile = $scope.single('agency:users', Auth.getUser()._id);
  });

}).call(this);
