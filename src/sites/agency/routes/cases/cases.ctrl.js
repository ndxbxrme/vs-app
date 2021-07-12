// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-agency').controller('agencyCasesCtrl', function($scope, env) {
    $scope.page = 1;
    $scope.limit = 15;
    $scope.pageChange = function() {
      return $('html, body').animate({
        scrollTop: 0
      }, 200);
    };
    $scope.nodeleted = 0;
    $scope.propsOpts = {
      where: {
        RoleStatus: 'OfferAccepted',
        RoleType: 'Selling',
        IncludeStc: true
      },
      transform: {
        items: 'Collection',
        total: 'TotalCount'
      }
    };
    $scope.properties = $scope.list({
      route: `${env.PROPERTY_URL}/search`
    }, $scope.propsOpts, function(properties) {
      var i, len, property, ref, results;
      ref = properties.items;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        property = ref[i];
        property.displayAddress = `${property.Address.Number} ${property.Address.Street}, ${property.Address.Locality}, ${property.Address.Town}, ${property.Address.Postcode}`;
        property.$case = $scope.single('agency:properties', property.RoleId, function(item) {
          var ref1;
          item.$parent.search = `${item.$parent.displayAddress}||${item.item.vendor}||${item.item.purchaser}`;
          item.$parent.milestoneStatus = item.item.milestoneStatus;
          if (item.item.progressions && item.item.progressions.length) {
            item.$parent.estCompletedTime = item.item.progressions[0].milestones[item.item.progressions[0].milestones.length - 1][0].estCompletedTime;
          }
          if (item.$parent.estCompletedTime < new Date().valueOf()) {
            item.$parent.needsDate = true;
          }
          item.$parent.deleted = ((ref1 = item.item.override) != null ? ref1.deleted : void 0) || false;
          if (item.$parent.deleted) {
            return $scope.nodeleted++;
          }
        });
        results.push(property.$case.$parent = property);
      }
      return results;
    });
    return $scope.hasRequest = function(property) {
      var i, len, ref, request;
      if ($scope.auth.checkRoles(['superadmin', 'admin']) && property.$case.item && property.$case.item.advanceRequests && property.$case.item.advanceRequests.length) {
        ref = property.$case.item.advanceRequests;
        for (i = 0, len = ref.length; i < len; i++) {
          request = ref[i];
          if (!request.dismissed && !request.applied) {
            return true;
          }
        }
      }
      return false;
    };
  });

}).call(this);
