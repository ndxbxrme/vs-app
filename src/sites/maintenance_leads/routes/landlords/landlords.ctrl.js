// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').controller('maintenance_leadslandlordsCtrl', function($scope, Sorter, alert) {
    $scope.page = 1;
    $scope.limit = 15;
    $scope.mysearch = {
      $like: ''
    };
    $scope.pageChange = function() {
      return $('html, body').animate({
        scrollTop: 0
      }, 200);
    };
    $scope.landlords = $scope.list('maintenance_leads:landlords', {
      page: 1,
      pageSize: $scope.limit,
      sort: 'name',
      sortDir: 'ASC',
      where: {
        name: $scope.mysearch
      }
    }, function(landlords) {
      var i, landlord, len, ref, results;
      ref = landlords.items;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        landlord = ref[i];
        results.push(landlord.issues = $scope.list('maintenance_leads:issues', {
          where: {
            statusName: 'Booked',
            $or: [
              {
                booked: landlord._id
              },
              {
                landlordName: landlord.name
              }
            ]
          }
        }));
      }
      return results;
    });
    $scope.landlords.sort = Sorter.create($scope.landlords.args);
    return $scope.deletelandlord = function(landlord) {
      return $scope.modal({
        template: require('../../modals/landlord-delete/landlord-delete.html').default,
        controller: 'maintenance_leadsIssueDeleteCtrl',
        size: 'small'
      }, $http.sites["maintenance_leads"].config).then(function() {
        $scope.landlords.delete(landlord);
        $state.go('maintenance_leads_landlords');
        return alert.log('landlord deleted');
      }, function(err) {
        return console.log('err', err);
      });
    };
  });

}).call(this);
