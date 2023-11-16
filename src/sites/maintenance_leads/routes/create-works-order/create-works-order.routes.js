// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').config(function($stateProvider) {
    return $stateProvider.state('maintenance_leads_createworksorder', {
      url: '/maintenance_leads/create-works-order/:_id',
      template: require("./create-works-order.html").default,
      controller: 'maintenance_leadsCreateWorksOrderCtrl',
      data: {
        title: 'Vitalspace Mainenance Leads - Create Works Order',
        auth: ['maintenance_leads:superadmin', 'maintenance_leads:admin', 'maintenance_leads:agency']
      }
    });
  });

}).call(this);