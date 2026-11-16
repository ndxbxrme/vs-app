(function() {
  'use strict';
  angular.module('vs-agency').config(function($stateProvider) {
    return $stateProvider.state('agency_admin', {
      url: '/agency/admin',
      template: require('./admin.html').default,
      controller: 'agencyAdminCtrl',
      data: {
        title: 'Vitalspace Sales - Admin',
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
