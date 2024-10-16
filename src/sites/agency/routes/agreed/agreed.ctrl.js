// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-agency').controller('agencyAgreedCtrl', function($scope, $filter, $timeout, $http) {
    var updateMonths, updateProperties, updateTargets, y;
    $scope.filterMode = "1";
    $scope.now = new Date().valueOf();
    $scope.years = [];
    y = new Date().getFullYear() + 1;
    while (y-- > 2017) {
      $scope.years.push(y);
    }
    updateMonths = function() {
      var month, results, testDate;
      $scope.months = [];
      testDate = new Date($scope.startDate['startDate']);
      results = [];
      while (testDate < $scope.endDate['startDate']) {
        month = {
          date: testDate,
          month: $filter('date')(testDate, 'MMMM'),
          properties: [],
          target: {
            type: 'salesAgreed',
            value: 0,
            date: testDate
          },
          search: ''
        };
        $scope.months.push(month);
        results.push(testDate = new Date(testDate.getFullYear(), testDate.getMonth() + 1, testDate.getDate()));
      }
      return results;
    };
    $scope.startDate = {
      startDate: 0
    };
    $scope.endDate = {
      startDate: 0
    };
    $scope.setDateRange = function(year) {
      $scope.currentYear = year;
      return $timeout(function() {
        $scope.startDate.startDate = new Date(year, 0, 1).valueOf();
        $scope.endDate.startDate = new Date(year + 1, 0, 1).valueOf();
        updateMonths();
        return updateProperties();
      });
    };
    $scope.setDateRange($scope.years[0]);
    updateTargets = function() {
      var j, len, month, ref, results, target;
      if ($scope.targets && $scope.targets.items && $scope.targets.items.length) {
        ref = $scope.targets.items;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          target = ref[j];
          results.push((function() {
            var k, len1, ref1, results1;
            ref1 = $scope.months;
            results1 = [];
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              month = ref1[k];
              if (new Date(target.date).toLocaleString() === month.date.toLocaleString()) {
                month.target = target;
                break;
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          })());
        }
        return results;
      }
    };
    let historic = {};
    ['2017', '2018', '2019', '2020', '2021', '2022'].map(year => $http.get('/public/data/conveyancing-agreed-' + year + '.json').then(res => {

      historic[year] = res.data.map(m => m.map(p => ({
        roleId: p.roleId,
        address: p.address,
        commission: p.commission,
        delisted: p.delisted,
        date: p.date
      })));
    }));
    updateProperties = function() {
      var completeBeforeDelisted, i, j, k, len, len1, milestone, month, progression, property, ref, ref1, results;
      ref = $scope.months;
      for (j = 0, len = ref.length; j < len; j++) {
        month = ref[j];
        month.properties = [];
        month.commission = 0;
      }
      if ($scope.properties && $scope.properties.items) {
        if(historic && historic[$scope.currentYear.toString()]) {
          for(let f = 0; f<$scope.months.length; f++) {
            $scope.months[f].properties = historic[$scope.currentYear.toString()][f].filter(prop => $scope.filterMode==="2"?prop.pipeline==='HOME':true);
            $scope.months[f].properties.forEach(p => {$scope.months[f].commission += p.commission});
          }
          return;
        }
        ref1 = $scope.properties.items;
        results = [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          property = ref1[k];
          if($scope.filterMode==="1" && property.pipeline==='HOME') {continue;}
          if($scope.filterMode==="2" && property.pipeline!=='HOME') {continue;}
          i = $scope.months.length;
          results.push((function() {
            var ref2, results1;
            results1 = [];
            while (i-- > 0) {
              month = $scope.months[i];
              if (($scope.endDate.startDate > (ref2 = new Date(property.startDate)) && ref2 > month.date)) {
                completeBeforeDelisted = false;
                if (property.progressions && property.progressions.length) {
                  progression = property.progressions[0];
                  milestone = progression.milestones[progression.milestones.length - 1];
                  completeBeforeDelisted = (!milestone[0].completed && property.delisted) || !property.delisted;
                }
                property.override = property.override || {};
                if (!property.override.deleted) {
                  month.commission += +property.override.commission || +property.role.Commission;
                  month.properties.push({
                    _id: property._id,
                    address: property.override.address || `${property.offer.Property.Address.Number} ${property.offer.Property.Address.Street}, ${property.offer.Property.Address.Locality}`,
                    commission: property.override.commission || property.role.Commission,
                    date: property.override.date || property.startDate,
                    roleId: property.roleId,
                    delisted: property.delisted,
                    completeBeforeDelisted: completeBeforeDelisted
                  });
                }
                break;
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          })());
        }
        return results;
      }
    };
    $scope.updateProperties = updateProperties;
    $scope.targets = $scope.list('agency:targets', {
      where: {
        type: 'salesAgreed'
      }
    }, updateTargets);
    $scope.properties = $scope.list('agency:properties', {
      where: {
        startDate: {
          $gt: new Date('2022-12-20').valueOf()
        }
      },
      sort: 'startDate',
      sortDir: 'ASC'
    }, updateProperties);
    $scope.open = function(selectedMonth) {
      var j, len, month, open, ref;
      open = selectedMonth.open;
      ref = $scope.months;
      for (j = 0, len = ref.length; j < len; j++) {
        month = ref[j];
        month.open = false;
      }
      return selectedMonth.open = !open;
    };
    $scope.edit = function(property) {
      if (!property.$override) {
        property.$override = {
          address: property.address,
          commission: property.commission,
          date: property.date
        };
      }
      return $timeout(function() {
        return property.$editing = true;
      });
    };
    $scope.delete = function(property) {
      return $http.post($http.sites["agency"].url + `/api/properties/${property._id}`, {
        override: {
          deleted: true
        }
      }, $http.sites.agency.config);
    };
    $scope.save = function(property) {
      return $http.post($http.sites["agency"].url + `/api/properties/${property._id}`, {
        override: property.$override
      }, $http.sites.agency.config);
    };
    $scope.cancel = function(property) {
      return property.$editing = false;
    };
    return $scope.saveTarget = function(month) {
      $http.post($http.sites["agency"].url + `/api/targets/${month.target._id || ''}`, month.target, $http.sites.agency.config);
      return month.editing = false;
    };
  });

}).call(this);
