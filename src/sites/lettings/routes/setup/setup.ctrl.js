// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-lettings-inner').controller('lettingsSetupCtrl', function($scope, $http, $filter, $timeout, LettingsProgressionPopup, alert) {
    var saveDashboard;
    $scope.editor = true;
    $scope.newUser = {
      role: 'agency'
    };
    $scope.progressions = $scope.list('lettings:progressions', {
      sort: 'i'
    }, function(progressions) {
      return LettingsProgressionPopup.setProgressions(progressions.items);
    });
    $scope.users = $scope.list('lettings:users');
    $scope.emailTemplates = $scope.list('lettings:emailtemplates');
    $scope.smsTemplates = $scope.list('lettings:smstemplates');
    $scope.dashboard = $scope.list('lettings:dashboard');
    $scope.getProperty = function() {
      return {
        Address: {
          Number: 123,
          Street: 'My Street',
          Locality: 'My Locality',
          Town: 'My Town'
        }
      };
    };
    $scope.addUser = function() {
      $scope.newUser.roles = {};
      $scope.newUser.roles[$scope.newUser.role] = {};
      delete $scope.newUser.role;
      $http.post($http.sites["lettings"].url + '/api/get-invite-code', $scope.newUser, $http.sites["lettings"].config).then(function(response) {
        $scope.inviteUrl = response.data;
        return alert.log('Invite sent');
      }, function(err) {
        return $scope.inviteError = err.data;
      });
      return $scope.newUser = {
        role: 'agency'
      };
    };
    $scope.copyInviteToClipboard = function() {
      $('.invite-url input').select();
      alert.log('Copied to clipboard');
      return document.execCommand('copy');
    };
    $scope.addProgression = function() {
      return $scope.progressions.save({
        name: 'New progression',
        side: 'Buyer',
        milestones: [
          [
            {
              title: 'Start',
              _id: $scope.generateId(8),
              actions: []
            }
          ]
        ]
      });
    };
    $scope.resetProgressions = function() {
      return $http.get($http.sites["lettings"].url + '/api/properties/reset-progressions', $http.sites["lettings"].config).then(function(response) {
        return alert.log('Progressions reset');
      });
    };
    saveDashboard = function() {
      var di, i, j, k, len, len1, ref, ref1;
      ref = $filter('orderBy')($filter('filter')($scope.dashboard.items, {
        type: 'overview'
      }), 'i');
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        di = ref[i];
        di.i = i;
        $scope.dashboard.save(di);
      }
      ref1 = $filter('orderBy')($filter('filter')($scope.dashboard.items, {
        type: 'income'
      }), 'i');
      for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
        di = ref1[i];
        di.i = i;
        $scope.dashboard.save(di);
      }
      return alert.log('Dashboard saved');
    };
    $scope.moveDIUp = function(di) {
      return $timeout(function() {
        di.i -= 1.1;
        //$scope.dashboard.items.moveUp di
        return $timeout(saveDashboard);
      });
    };
    $scope.moveDIDown = function(di) {
      return $timeout(function() {
        di.i += 1.1;
        //$scope.dashboard.items.moveDown di
        return $timeout(saveDashboard);
      });
    };
    return $scope.removeDI = function(di) {
      $scope.dashboard.delete(di);
      $scope.dashboard.items.remove(di);
      return saveDashboard();
    };
  });

}).call(this);
