// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance').controller('maintenanceTaskCtrl', function($scope, $rootScope, $http, $window, $timeout, ndxModalInstance, Upload, alert, maintenanceProperty, data) {
    var deref;
    $scope.jobs = [];
    $scope.forms = {};
    $scope.getProperties = maintenanceProperty.getProperties;
    $scope.task = Object.assign({}, data.task);
    $scope.maintenance = data.maintenance;
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
    $scope.jobtypes = $scope.single('maintenance:jobtypes', {
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
      return ndxModalInstance.close();
    };
    $scope.save = function() {
      var property;
      $scope.submitted = true;
      if ($scope.forms.myForm.$valid || $scope.task.status === 'quote') {
        property = maintenanceProperty.getProperty($scope.task.property);
        $scope.task.title = `${$scope.task.job}, ${$scope.task.property}`;
        $scope.task.dateVal = $scope.task.date.valueOf();
        return $http.post($http.sites["maintenance"].url + `/api/tasks/${$scope.task._id || ''}`, $scope.task, $http.sites["maintenance"].config).then(function(response) {
          return ndxModalInstance.dismiss();
        }, function(err) {
          return false;
        });
      }
    };
    $scope.delete = function() {
      if ($window.confirm('Are you sure you want to delete this task?')) {
        return $http.delete($http.sites["maintenance"].url + `/api/tasks/${$scope.task._id}`, $http.sites["maintenance"].config).then(function(response) {
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
          url: $http.sites["maintenance"].url + '/api/upload',
          data: {
            file: files,
            user: $scope.auth.getUser()
          },
          headers: $http.sites["maintenance"].config.headers
        }, $http.sites["maintenance"].config).then(function(response) {
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
  });

}).call(this);
