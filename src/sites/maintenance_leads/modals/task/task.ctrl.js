// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').controller('maintenance_leadsTaskCtrl', function($scope, $rootScope, $http, $window, $timeout, ndxModalInstance, Upload, alert, data) {
    var deref, originalDate;
    $scope.jobs = [];
    $scope.forms = {};
    //$scope.getProperties =  Property.getProperties
    $scope.task = Object.assign({}, data.task);
    originalDate = new Date(new Date($scope.task.date).toDateString());
    $scope.task.duration = new Date(originalDate.valueOf() + $scope.task.duration);
    $scope.contractors = data.contractors;
    $scope.cfpJobNumber = data.cfpJobNumber || '';
    $scope.needsJobNumber = data.needsJobNumber;
    $scope.statuses = [
      {
        id: 'quote',
        name: 'Quote'
      },
      {
        id: 'confirmed',
        name: 'Confirmed'
      },
      {
        id: 'completed',
        name: 'Completed'
      }
    ];
    $scope.jobtypes = $scope.single('maintenance_leads:jobtypes', {
      type: 'default'
    }, function(jobtypes) {
      if (jobtypes && jobtypes.item && jobtypes.item.jobs) {
        return $timeout(function() {
          return $scope.jobs = jobtypes.item.jobs.trim().split('\n');
        });
      }
    });
    $scope.setDate = function() {
      return $rootScope.$emit('swiper:show', $scope.task.date);
    };
    deref = $rootScope.$on('set-date', function(e, date) {
      var sel;
      sel = new Date(date);
      return $scope.task.date = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate(), $scope.task.date.getHours(), $scope.task.date.getMinutes());
    });
    $scope.$on('$destroy', function() {
      return deref();
    });
    $scope.cancel = function() {
      return ndxModalInstance.dismiss();
    };
    $scope.saveMLTask = function() {
      $scope.submitted = true;
      if ($scope.forms.myForm.$valid || $scope.task.status === 'quote') {
        $scope.submitTask = Object.assign({}, $scope.task);
        //property = Property.getProperty $scope.task.property
        $scope.submitTask.duration = $scope.submitTask.duration.valueOf() - originalDate.valueOf();
        $scope.submitTask.dateVal = $scope.submitTask.date.valueOf();
        $scope.submitTask.status = $scope.submitTask.status || {
          booked: true
        };
        $scope.submitTask.cfpJobNumber = $scope.cfpJobNumber;
        return $http.post($http.sites["maintenance_leads"].url + `/api/tasks/${$scope.task._id || ''}`, $scope.submitTask, $http.sites["maintenance_leads"].config).then(function(response) {
          return ndxModalInstance.dismiss();
        }, function(err) {
          return false;
        });
      }
    };
    $scope.delete = function() {
      if ($window.confirm('Are you sure you want to delete this task?')) {
        return $http.delete($http.sites["maintenance_leads"].url + `/api/tasks/${$scope.task._id}`, $http.sites["maintenance_leads"].config).then(function(response) {
          return ndxModalInstance.dismiss();
        }, function(err) {
          return false;
        });
      }
    };
    $scope.deleteDocument = function(document) {
      if ($window.confirm('Are you sure you want to delete this document?')) {
        $scope.task.documents.splice($scope.task.documents.indexOf(document), 1);
        return alert.log('Document deleted');
      }
    };
    $scope.uploadFiles = function(files, errFiles) {
      if (files) {
        $scope.uploadProgress = 0;
        $scope.documentUploading = true;
        return Upload.upload({
          url: $http.sites["maintenance_leads"].url + '/api/upload',
          data: {
            file: files,
            user: $scope.auth.getUser()
          },
          headers: $http.sites["maintenance_leads"].config.headers
        }, $http.sites["maintenance_leads"].config).then(function(response) {
          var document, i, len, ref;
          $scope.documentUploading = false;
          if (response.data) {
            $scope.uploadProgress = 0;
            if (!$scope.task.documents) {
              $scope.task.documents = [];
            }
            ref = response.data;
            for (i = 0, len = ref.length; i < len; i++) {
              document = ref[i];
              $scope.task.documents.push(document);
            }
            return alert.log('Document uploaded');
          }
        }, function(err) {
          $scope.documentUploading = false;
          return false;
        }, function(progress) {
          return $scope.uploadProgress = Math.min(100, parseInt(100.0 * progress.loaded / progress.total));
        });
      }
    };
    $scope.chaseContractor = function(method, task) {
      return $http.get($http.sites["maintenance_leads"].url + '/api/chase/' + method + '/' + task._id, $http.sites["maintenance_leads"].config).then(function(res) {
        if (res.data === 'OK') {
          return $http.get($http.sites["maintenance_leads"].url + '/api/inform/' + method + '/' + task._id, $http.sites["maintenance_leads"].config).then(function(res) {
            if (res.data === 'OK') {
              return alert.log(method + ' sent');
            }
          });
        }
      });
    };
    $scope.chaseInvoice = function(method, task) {
      return $http.get($http.sites["maintenance_leads"].url + '/api/chase-invoice/' + method + '/' + task._id, $http.sites["maintenance_leads"].config).then(function(res) {
        if (res.data === 'OK') {
          return alert.log('Invoice chased');
        }
      });
    };
    return $scope.informTenant = function(method, task) {
      return $http.get($http.sites["maintenance_leads"].url + '/api/inform/' + method + '/' + task._id, $http.sites["maintenance_leads"].config).then(function(res) {
        if (res.data === 'OK') {
          return alert.log('Tenant informed');
        }
      });
    };
  });

}).call(this);
