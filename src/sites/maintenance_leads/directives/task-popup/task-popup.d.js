// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').directive('taskPopup', function($http, alert, TaskPopup) {
    return {
      restrict: 'EA',
      template: require("./task-popup.html").default,
      replace: true,
      link: function(scope, elem, attrs) {
        scope.getTask = TaskPopup.getTask;
        scope.getHidden = TaskPopup.getHidden;
        scope.getDateTo = function() {
          var task;
          task = TaskPopup.getTask();
          if (task) {
            return new Date(task.date.valueOf() + task.duration.valueOf());
          }
        };
        scope.chaseContractor = function(method, task) {
          return $http.get($http.sites["maintenance_leads"].url + '/api/chase/' + method + '/' + scope.getTask()._id, $http.sites["maintenance_leads"].config).then(function(res) {
            if (res.data === 'OK') {
              return alert.log('Contractor chased');
            }
          });
        };
        scope.informTenant = function(method, task) {
          return $http.get($http.sites["maintenance_leads"].url + '/api/inform/' + method + '/' + scope.getTask()._id, $http.sites["maintenance_leads"].config).then(function(res) {
            if (res.data === 'OK') {
              return alert.log('Tenant informed');
            }
          });
        };
        scope.save = function() {
          if (!TaskPopup.getHidden() && scope.getTask()) {
            return $http.post($http.sites["maintenance_leads"].url + `/api/tasks/${scope.getTask()._id || ''}`, scope.getTask(), $http.sites["maintenance_leads"].config).then(function(response) {
              return alert.log('Task updated');
            }, function(err) {
              return false;
            });
          }
        };
        scope.complete = function() {
          scope.getTask().status = 'completed';
          return scope.save();
        };
        return scope.edit = function(task) {
          TaskPopup.hide();
          return scope.modal({
            template: require('../../modals/task/task.html').default,
            controller: 'maintenance_leadsTaskCtrl',
            data: {
              task: task,
              maintenance: scope.maintenance,
              contractors: TaskPopup.getContractors()
            }
          }, $http.sites["maintenance_leads"].config).then(function(response) {
            return true;
          }, function(err) {
            return false;
          });
        };
      }
    };
  });

}).call(this);
