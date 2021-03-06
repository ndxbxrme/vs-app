// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-agency').config(function($stateProvider) {
    return $stateProvider.state('agency_setup', {
      url: '/agency/setup',
      template: require("./setup.html").default,
      controller: 'agencySetupCtrl',
      data: {
        title: 'Vitalspace Conveyancing - Setup',
		auth: ['agency:admin', 'agency:superadmin']
      },
      resolve: {
        user: function(Auth) {
          return Auth.getPromise(['agency:admin', 'agency:superadmin']);
        }
      }
    });
  });

}).call(this);
