// Generated by CoffeeScript 2.6.0
(function() {
  'use strict';
  angular.module('vs-agency').controller('agencyOffersListCtrl', function($scope, $interval, $http, env) {
    $scope.page = 1;
    $scope.limit = 6;
    $scope.offers = $scope.list('leads:offers', {
      where: {
        actioned: null
      },
      sort: 'date',
      sortDir: 'DESC'
    }, (offers) => {
      offers.items.forEach(async offer => {
        console.log(offer);
        offer.date = new Date(offer.date);
        offer.search = (`${offer.address}:${offer.applicant}:${offer.applicant2 || ''}`).toLowerCase();
      })
    }, $http.sites["agency"].config);
    $scope.formatAddress = (address) => {
      if(!address) return '';
      return address.replace(/, ,/g, ',');
    }
    $scope.formatDate = (date) => {
      return new Date(date).toString().split(/ /g).slice(0, 5).join(' ').replace(/:\d\d$/, '');
    }
  });

}).call(this);
