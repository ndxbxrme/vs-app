'use strict';

angular.module('vs-lettings').controller('lettingsDashboardPropertiesCtrl', function($scope, $state, data, ndxModalInstance) {
  $scope.data = data;

  $scope.cancel = function() {
    ndxModalInstance.dismiss();
  };

  $scope.getAddress = function(property) {
    if (!property) return 'Address unavailable';
    if (property.override && property.override.address) return property.override.address;
    if (property.displayAddress) return property.displayAddress;
    if (property.address) return property.address;

    var address = property.Address || {};
    return [address.Number, address.Street, address.Locality, address.Town, address.Postcode]
      .filter(Boolean)
      .join(', ') || 'Address unavailable';
  };

  $scope.getRoleId = function(property) {
    if (!property) return null;

    var roleId = property.RoleId || property.roleId;
    if (roleId) return roleId;

    if (typeof property._id === 'string') {
      var match = property._id.match(/^(\d+)_/);
      if (match) return +match[1];
    }
    return null;
  };

  $scope.matchesSearch = function(property) {
    return !$scope.search ||
      $scope.getAddress(property).toLowerCase().indexOf($scope.search.toLowerCase()) !== -1;
  };

  $scope.goToCase = function(property) {
    var roleId = $scope.getRoleId(property);
    if (!roleId) return;
    ndxModalInstance.close();
    $state.go('lettings_case', {roleId: roleId});
  };
});
