// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-agency').config(function($stateProvider) {
    return $stateProvider.state('agency_marketing', {
      url: '/agency/marketing',
      template: require("./marketing.html").default,
      controller: 'agencyMarketingCtrl',
      data: {
        title: 'Vitalspace Conveyancing - Marketing Forms',
        hideMenu: true,
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
