// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance').controller('maintenanceDashboardCtrl', function($scope, $compile, MaintenanceTaskPopup) {
    var userFormat;
    userFormat = function(data) {
      var user;
      if(!$scope.users) return;
      if (user = $scope.selectById($scope.users.items, data.id)) {
        return $compile(`<img gravatar-src='\"${user.local.email}\"' /> <span>${user.displayName || user.local.email}</span>`)($scope);
      }
    };
    $scope.userSelectOptions = {
      minimumResultsForSearch: 2e308,
      formatResult: userFormat,
      formatSelection: userFormat,
      theme: 'usertheme',
      containerCssClass: ':all:'
    };
    $scope.hidePopup = function() {
      return MaintenanceTaskPopup.hide();
    };
    return $scope.today = new Date();
  });

}).call(this);
