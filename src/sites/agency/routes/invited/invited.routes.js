// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-agency').config(function($stateProvider) {
    return $stateProvider.state('agency_invited', {
      url: '/agency/invited',
      template: require("./invited.html").default,
      controller: 'agencyInvitedCtrl',
      data: {
        title: 'Vitalspace Conveyancing - Invited'
      }
    });
  });

}).call(this);
