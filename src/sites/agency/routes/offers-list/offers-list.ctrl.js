// Generated by CoffeeScript 2.6.0
(function() {
  'use strict';
  angular.module('vs-agency').controller('agencyOffersListCtrl', function($scope, $timeout, $http, $state, env) {
    $scope.isHistoric = false;
    if($state && $state.current && $state.current.data && $state.current.data.data && $state.current.data.data.isHistoric) {
      $scope.isHistoric = true;
    }
    $scope.page = 1;
    $scope.limit = 20;
    $scope.options = {
      where: {
        actioned: null
      },
      sort: 'date',
      sortDir: 'DESC'
    }
    if($scope.isHistoric) {
      $scope.options.where.actioned = {$nn:true};
    }
    $scope.offers = $scope.list('leads:offers', $scope.options, (offers) => {
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
    $scope.showHistoric = () => {
      console.log('show historic');
      $timeout(() => {
        $scope.offers.args = {
          where: {
            actioned: {
              $nn: true
            }
          },
          sort: 'date',
          sortDir: 'DESC'
        }
        $scope.offers.refreshFn();
      })
    }
  });

}).call(this);
