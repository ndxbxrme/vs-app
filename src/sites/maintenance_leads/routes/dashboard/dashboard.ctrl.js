// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').directive('maintenanceleadsDashboard', function(Sorter) {
    return {
      template: require("./dashboard.html").default,
      scope: {},
      link: (scope) => {
        var now, yesterday;
        now = new Date();
        yesterday = new Date().setHours(now.getHours() - 24);
        scope.maintenanceToday = scope.list('maintenance_leads:issues', {
          page: 1,
          pageSize: 10,
          where: {
            date: {
              $gt: yesterday.valueOf()
            },
            search: {
              $like: ''
            },
            statusName: 'Reported'
          },
          sort: 'date',
          sortDir: 'DESC'
        });
        scope.maintenanceToday.sort = Sorter.create(scope.maintenanceToday.args);
        scope.maintenanceOutstanding = scope.list('maintenance_leads:issues', {
          page: 1,
          pageSize: 10,
          where: {
            date: {
              $lte: yesterday.valueOf()
            },
            search: {
              $like: ''
            },
            statusName: 'Reported'
          },
          sort: 'date',
          sortDir: 'DESC'
        });
        scope.maintenanceOutstanding.sort = Sorter.create(scope.maintenanceOutstanding.args);
        scope.worksOutstanding = scope.list('maintenance_leads:issues', {
          page: 1,
          pageSize: 10,
          where: {
            statusName: 'Booked',
            search: {
              $like: ''
            },
            status: {
              booked: true,
              completed: false,
              invoiced: false
            }
          },
          sort: 'date',
          sortDir: 'DESC'
        });
        scope.worksOutstanding.sort = Sorter.create(scope.worksOutstanding.args);
        scope.invoiceOutstanding = scope.list('maintenance_leads:issues', {
          page: 1,
          pageSize: 10,
          where: {
            statusName: 'Booked',
            search: {
              $like: ''
            },
            status: {
              completed: true,
              booked: true,
              invoiced: false
            }
          },
          sort: 'date',
          sortDir: 'DESC'
        });
        scope.invoiceOutstanding.sort = Sorter.create(scope.invoiceOutstanding.args);
        return true;
      }
    }
  });

}).call(this);
