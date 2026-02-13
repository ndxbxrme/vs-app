'use strict';

angular.module('vs-lettings').controller('lettingsAgreedPropertiesCtrl', function($scope, data, ndxModalInstance) {
  $scope.month = data.month;
  $scope.year = data.year;
  $scope.auth = $scope.$parent.auth || {};
  
  $scope.save = function(property) {
    if (data.save) {
      data.save(property);
    }
    property.$editing = false;
  };
  
  $scope.edit = function(property) {
    if (data.edit) {
      data.edit(property);
    }
  };
  
  $scope.deleteProperty = function(property) {
    if (data.deleteProperty) {
      data.deleteProperty(property);
    }
  };
  
  $scope.cancelEdit = function(property) {
    if (data.cancelEdit) {
      data.cancelEdit(property);
    }
  };
  
  $scope.cancel = function() {
    ndxModalInstance.dismiss();
  };
});
