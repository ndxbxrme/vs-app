// Generated by CoffeeScript 2.6.0
(function() {
  'use strict';
  angular.module('vs-agency').controller('agencyClientManagementListCtrl', function($scope, $interval, $http, env) {
    $scope.page = 1;
    $scope.limit = 15;
    let runOnce = false;
    $scope.pageChange = function() {
      return $('html, body').animate({
        scrollTop: 0
      }, 200);
    };
    $scope.properties = $scope.list('agency:clientmanagement', {
      where: {
        active: true
      }
    }, function(properties) {
      var i, len, property, ref, results;
      ref = properties.items;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        property = ref[i];
        results.push(property.displayAddress = `${property.Address.Number} ${property.Address.Street}, ${property.Address.Locality}, ${property.Address.Town}, ${property.Address.Postcode}`);
      }
      if(!runOnce) {
        runOnce = true;
        fetchDetails();
      }
      return results;
    });
    const fetchDetails = async () => {
      if(!$scope.properties.items || !$scope.properties.items.length) return;
      for(let property of $scope.properties.items) {
        //await $http.post('https://server.vitalspace.co.uk/dezrez/refresh/' + (property.RoleId || property.roleId));
      }
    }
    const iv = $interval(fetchDetails, 30 * 60 * 1000)
    $scope.$on('$destroy', () => {
      $interval.cancel(iv);
    });
  });

}).call(this);
