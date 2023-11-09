// Generated by CoffeeScript 2.6.0
(function() {
  'use strict';
  angular.module('vs-agency').config(function($stateProvider) {
    $stateProvider.state('agency_client-management-details', {
      url: '/agency/client-management/:id',
      template: require("./client-management-details.html").default,
      controller: 'agencyClientManagementDetailsCtrl',
      data: {
        title: 'Vitalspace Conveyancing - Client Management',
		    auth: ['agency:agency', 'agency:admin', 'agency:superadmin']
      },
      resolve: {
        user: function(Auth) {
          return Auth.getPromise(['agency:agency', 'agency:admin', 'agency:superadmin']);
        }
      }
    });
    $stateProvider.state('agency_client-management-details-roleid', {
      url: '/agency/client-management/roleid/:roleid',
      template: require("./client-management-details.html").default,
      controller: 'agencyClientManagementDetailsCtrl',
      data: {
        title: 'Vitalspace Conveyancing - Client Management',
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
