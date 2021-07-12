// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-leads').config(function($stateProvider) {
    return $stateProvider.state('leads_history', {
      url: '/leads/history',
      template: require("./history.html").default,
      controller: 'leadsHistoryCtrl',
      data: {
        title: 'history',
        auth: ['leads:superadmin', 'leads:admin']
      }
    });
  });

}).call(this);
