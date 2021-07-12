// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').config(function($stateProvider) {
    $stateProvider.state('maintenance_leads_forgot', {
      url: '/maintenance_leads/forgot',
      template: require("./forgot.html").default,
      controller: 'maintenance_leadsForgotCtrl'
    });
    return $stateProvider.state('maintenance_leads_forgotResponse', {
      url: '/maintenance_leads/forgot/:token',
      templateUrl: 'routes/forgot/forgot.html',
      controller: 'maintenance_leadsForgotCtrl'
    });
  });

}).call(this);
