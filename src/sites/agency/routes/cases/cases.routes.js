// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-agency').config(function($stateProvider) {
    return $stateProvider.state('agency_cases', {
      url: '/agency/cases',
      template: require("./cases.html").default,
      controller: 'agencyCasesCtrl',
      data: {
        title: 'Vitalspace Conveyancing - Cases',
		auth: ['agency:agency', 'agency:admin', 'agency:superadmin']
      },
      resolve: {
        user: function(Auth) {
          return Auth.getPromise(['agency:agency', 'agency:admin', 'agency:superadmin']);
        }
      }
    });
  });

}).call(this);
