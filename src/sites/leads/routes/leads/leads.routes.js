// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-leads').config(function($stateProvider) {
    $stateProvider.state('leads_leads', {
      url: '/leads/leads',
      template: require("./leads.html").default,
      controller: 'leadsLeadsCtrl',
      data: {
        title: 'Vitalspace Leads - Leads',
        auth: ['leads:superadmin', 'leads:admin', 'leads:agency']
      }
    });
    $stateProvider.state('leads_selling', {
      url: '/leads/selling',
      template: require("./leads.html").default,
      controller: 'leadsLeadsCtrl',
      params: {
        roleType: 'Selling',
        booked: null
      },
      data: {
        title: 'Vitalspace Leads - Selling',
        auth: ['leads:superadmin', 'leads:admin', 'leads:agency']
      }
    });
    $stateProvider.state('leads_letting', {
      url: '/leads/letting',
      template: require("./leads.html").default,
      controller: 'leadsLeadsCtrl',
      params: {
        roleType: 'Letting',
        booked: null
      },
      data: {
        title: 'Vitalspace Leads - Letting',
        auth: ['leads:superadmin', 'leads:admin', 'leads:agency']
      }
    });
    return $stateProvider.state('leads_valuation', {
      url: '/leads/valuation',
      template: require("./leads.html").default,
      controller: 'leadsLeadsCtrl',
      params: {
        roleType: 'Valuation',
        booked: null
      },
      data: {
        title: 'Vitalspace Leads - Letting',
        auth: ['leads:superadmin', 'leads:admin', 'leads:agency']
      }
    });
  });

}).call(this);
