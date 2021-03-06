// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-lettings-inner').config(function($stateProvider) {
    return $stateProvider.state('lettings_agreed', {
      url: '/lettings/agreed',
      template: require("./agreed.html").default,
      controller: 'lettingsAgreedCtrl',
      data: {
        title: 'Vitalspace Lettings - Agreed',
		auth: ['lettings:agency', 'lettings:admin', 'lettings:superadmin']
      },
      resolve: {
        user: function(Auth) {
          return Auth.getPromise(['lettings:agency', 'lettings:admin', 'lettings:superadmin']);
        }
      }
    });
  });

}).call(this);
