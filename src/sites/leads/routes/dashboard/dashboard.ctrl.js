// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-leads').directive('leadsDashboard', function() {
    return {
      template: require("./dashboard.html").default,
      scope: {},
      link: (scope) => {
        return scope.auth.onUser(function() {
          scope.sellingToday = scope.list('leads:leads', {
            preRefresh: function(args) {
              var end, start;
              end = new Date();
              start = new Date(new Date().setDate(end.getDate() - 1));
              return args.where = {
                date: {
                  $gte: start.valueOf(),
                  $lte: end.valueOf()
                },
                roleType: 'Selling'
              };
            },
            page: 1,
            pageSize: 0
          });
          scope.sellingOutstanding = scope.list('leads:leads', {
            preRefresh: function(args) {
              var end, now;
              now = new Date();
              end = new Date(new Date().setDate(now.getDate() - 1));
              return args.where = {
                date: {
                  $lte: end.valueOf()
                },
                roleType: 'Selling',
                booked: null
              };
            },
            page: 1,
            pageSize: 0
          });
          scope.lettingToday = scope.list('leads:leads', {
            preRefresh: function(args) {
              var end, start;
              end = new Date();
              start = new Date(new Date().setDate(end.getDate() - 1));
              return args.where = {
                date: {
                  $gte: start.valueOf(),
                  $lte: end.valueOf()
                },
                roleType: 'Letting'
              };
            },
            page: 1,
            pageSize: 0
          });
          scope.lettingOutstanding = scope.list('leads:leads', {
            preRefresh: function(args) {
              var end, now;
              now = new Date();
              end = new Date(new Date().setDate(now.getDate() - 1));
              return args.where = {
                date: {
                  $lte: end.valueOf()
                },
                roleType: 'Letting',
                booked: null
              };
            },
            page: 1,
            pageSize: 0
          });
          scope.valuationToday = scope.list('leads:leads', {
            preRefresh: function(args) {
              var end, start;
              end = new Date();
              start = new Date(new Date().setDate(end.getDate() - 1));
              return args.where = {
                date: {
                  $gte: start.valueOf(),
                  $lte: end.valueOf()
                },
                roleType: 'Valuation'
              };
            },
            page: 1,
            pageSize: 0
          });
          return scope.valuationOutstanding = scope.list('leads:leads', {
            preRefresh: function(args) {
              var end, now;
              now = new Date();
              end = new Date(new Date().setDate(now.getDate() - 1));
              return args.where = {
                date: {
                  $lte: end.valueOf()
                },
                roleType: 'Valuation',
                booked: null
              };
            },
            page: 1,
            pageSize: 0
          });
        });
      }
    }
  });

}).call(this);
