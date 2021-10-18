// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  var e;

  angular.module('vs-maintenance', ['ndx', 'ui.router', 'ui.gravatar', 'ui.select2', 'maintenance-date-swiper', 'ngFileUpload', 'ng-sumoselect']).config(function($locationProvider, $urlRouterProvider, gravatarServiceProvider) {
    gravatarServiceProvider.defaults = {
      size: 24,
      "default": 'mm',
      rating: 'pg'
    };
    $urlRouterProvider.otherwise('/');
    return $locationProvider.html5Mode(true);
  }).run(function($rootScope, ndxModal, $state, $timeout, MaintenanceTaskPopup, Auth) {
    var root;
    root = Object.getPrototypeOf($rootScope);
    root.generateId = function(len) {
      var i, letters, output;
      letters = "abcdefghijklmnopqrstuvwxyz0123456789";
      output = '';
      i = 0;
      while (i++ < len) {
        output += letters[Math.floor(Math.random() * letters.length)];
      }
      return output;
    };
    root.modal = function(args) {
      var backdrop, controller, modalInstance, size;
      size = args.size || 'large';
      controller = args.controller || 'YesNoCancelCtrl';
      backdrop = args.backdrop || 'static';
      modalInstance = ndxModal.open({
        templateUrl: args.template,
        windowClass: size,
        controller: controller,
        backdrop: backdrop,
        resolve: {
          data: function() {
            return args.data;
          }
        }
      });
      return modalInstance.result;
    };
    root.state = function(state) {
      return $state.is(state);
    };
    root.selectById = function(list, id) {
      var item, j, len1, output;
      output = null;
      if (list && list.length) {
        for (j = 0, len1 = list.length; j < len1; j++) {
          item = list[j];
          if (item._id === id) {
            output = item;
            break;
          }
        }
      }
      return output;
    };
    Auth.onUser(function() {
      return root.users = $rootScope.list('maintenance:users', null, function(users) {
        var j, len1, ref, results, user;
        root.maintenance = [];
        root.staff = [];
        ref = users.items;
        results = [];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          user = ref[j];
          if (user.roles) {
            if (user.roles.maintenance) {
              root.maintenance.push(user);
              if (!$rootScope.selectedUser) {
                $rootScope.selectedUser = user;
              }
            }
            if (user.roles.agency) {
              results.push(root.staff.push(user));
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
    });
    return $rootScope.bodyTap = function(e) {
      var elm, isPopup;
      $rootScope.mobileMenuOut = false;
      elm = e.target;
      isPopup = false;
      while (elm && elm.tagName !== 'BODY') {
        if (elm.className === 'popup') {
          isPopup = true;
          break;
        }
        elm = elm.parentNode;
      }
      if (!isPopup) {
        if (!MaintenanceTaskPopup.getHidden()) {
          MaintenanceTaskPopup.hide();
          return MaintenanceTaskPopup.cancelBubble = true;
        }
      }
    };
  });

  try {
    angular.module('ndx');
  } catch (error) {
    e = error;
    angular.module('ndx', []); //ndx module stub
  }

}).call(this);
