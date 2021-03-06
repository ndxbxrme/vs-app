// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-lettings').controller('lettingsAdvanceProgressionCtrl', function($scope, data, $http, ndxModalInstance) {
    $scope.data = data;
    $scope.submit = function() {
      return $http.post($http.sites["lettings"].url + '/api/properties/advance-progression', $scope.data, $http.sites["lettings"].config).then(function() {
        return ndxModalInstance.dismiss();
      }, function(e) {
        return ndxModalInstance.dismiss();
      });
    };
    return $scope.cancel = function() {
      return ndxModalInstance.dismiss();
    };
  });

}).call(this);
