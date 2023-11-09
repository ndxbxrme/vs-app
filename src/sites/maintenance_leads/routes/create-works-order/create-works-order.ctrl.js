// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').controller('maintenance_leadsCreateWorksOrderCtrl', function($scope, $stateParams) {
    $scope.worksOrder = {};
    $scope.issue = $scope.single('maintenance_leads:issues', $stateParams, function(issue) {
      console.log('issue', issue);
    });
    $scope.contractors = $scope.list('maintenance_leads:contractors');
    $scope.landlords = $scope.list('maintenance_leads:landlords');
  });

}).call(this);
