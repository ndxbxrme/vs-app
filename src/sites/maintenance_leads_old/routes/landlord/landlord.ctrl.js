// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').controller('maintenance_leadslandlordCtrl', function($scope, $stateParams) {
    var addressesMatch;
    $scope.landlord = $scope.single('maintenance_leads:landlords', $stateParams);
    addressesMatch = function(add1, add2) {
      var good, i;
      add1 = add1.toUpperCase().replace(/[, ]+/g, '');
      add2 = add2.toUpperCase().replace(/[, ]+/g, '');
      if (!add1 || !add2) {
        return false;
      }
      i = Math.min(30, Math.min(add1.length, add2.length));
      good = true;
      while (i-- > 0) {
        good = good && (add1[i] === add2[i]);
      }
      return good;
    };
    return $scope.issues = $scope.list('maintenance_leads:issues', null, function(issues) {
      var address, addresses, currentAddress, currentPostcode, j, len;
      issues.items.sort(function(a, b) {
        if (a.address > b.address) {
          return 1;
        } else {
          return -1;
        }
      });
      issues.items.sort(function(a, b) {
        if (a.postcode > b.postcode) {
          return 1;
        } else {
          return -1;
        }
      });
      currentAddress = "";
      currentPostcode = "";
      addresses = [];
      issues.items = issues.items.map(function(issue) {
        if (currentPostcode !== issue.postcode.toUpperCase()) {
          addresses.push(currentAddress);
          currentAddress = issue.address;
          return currentPostcode = issue.postcode.toUpperCase();
        } else {
          if (addressesMatch(currentAddress, issue.address)) {
            return currentAddress = currentAddress.length > issue.address.length ? currentAddress : issue.address;
          } else {
            return addresses.push(currentAddress);
          }
        }
      });
      $scope.addresses = [];
      for (j = 0, len = addresses.length; j < len; j++) {
        address = addresses[j];
        if (address && !$scope.addresses.find(function(myaddress) {
          return myaddress.toUpperCase() === address.toUpperCase();
        })) {
          $scope.addresses.push(address);
        }
      }
      $scope.addresses.sort(function(a, b) {
        if (a.replace(/\S*\d+\S*|^apartment|^apt|^flat|,/gi, '').trim() > b.replace(/\S*\d+\S*|^apartment|^apt|^flat|,/gi, '').trim()) {
          return 1;
        } else {
          return -1;
        }
      });
      return $scope.addresses = $scope.addresses.map(function(address) {
        return {
          _id: address,
          name: address
        };
      });
    });
  });

}).call(this);
