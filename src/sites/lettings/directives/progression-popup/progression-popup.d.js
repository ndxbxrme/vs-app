// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-lettings-inner').directive('lettingsProgressionPopup', function($rootScope, $timeout, LettingsProgressionPopup, alert) {
    return {
      restrict: 'AE',
      template: require("./progression-popup.html").default,
      replace: true,
      scope: {},
      link: function(scope, elem) {
        var addingNote, deregister, findByValue, getDateDiff, templateDeref;
        LettingsProgressionPopup.setScope(scope);
        addingNote = false;
        scope.action = null;
        scope.editorState = '';
        scope.icons = ['cathead', 'house', 'epc', 'instruction', 'draft', 'fandf', 'survey', 'offer', 'raised', 'satisfied', 'applied', 'complete', 'report', 'exchange', 'invoice', 'completion'];
        scope.contactOptions = [
          {
            id: 'purchasersContact',
            name: 'Tenant'
          },
          {
            id: 'vendorsContact',
            name: 'Landlord'
          },
          {
            id: 'allagency',
            name: 'All agency users'
          },
          {
            id: 'alladmin',
            name: 'All admin users'
          }
        ];
        scope.users = scope.list('lettings:users');
        templateDeref = scope.$watch(function() {
          return scope.auth.getUser();
        }, function(n) {
          if (n) {
            scope.emailTemplates = scope.list('lettings:emailtemplates');
            scope.smsTemplates = scope.list('lettings:smstemplates');
            return templateDeref();
          }
        });
        scope.getData = LettingsProgressionPopup.getData;
        scope.getTitle = LettingsProgressionPopup.getTitle;
        scope.setCompleted = LettingsProgressionPopup.setCompleted;
        scope.getCompleted = LettingsProgressionPopup.getCompleted;
        scope.getCompletedTime = LettingsProgressionPopup.getCompletedTime;
        scope.getProgressing = LettingsProgressionPopup.getProgressing;
        scope.getHidden = LettingsProgressionPopup.getHidden;
        scope.getNotes = LettingsProgressionPopup.getNotes;
        scope.hide = LettingsProgressionPopup.hide;
        scope.getProgressions = LettingsProgressionPopup.getProgressions;
        scope.getDate = LettingsProgressionPopup.getDate;
        scope.setDate = function() {
          return $rootScope.$emit('swiper:show', LettingsProgressionPopup.getDate());
        };
        scope.setProgressing = function() {
          return LettingsProgressionPopup.setProgressing();
        };
        getDateDiff = function(startDate, endDate) {
          var end, nodays, start;
          end = moment(endDate);
          start = moment(startDate).startOf('day');
          nodays = end.diff(start, 'days');
          return nodays + (nodays === 1 ? ' day' : ' days');
        };
        scope.getEstDays = function() {
          return LettingsProgressionPopup.getEstDays();
        };
        scope.isStart = function() {
          var title;
          title = LettingsProgressionPopup.getTitle();
          return title === 'Start';
        };
        scope.addNote = function() {
          console.log('lettings add note');
          return addingNote = true;
        };
        scope.addingNote = function() {
          return addingNote;
        };
        scope.doAddNote = function() {
          LettingsProgressionPopup.addNote(scope.note);
          scope.note = '';
          return addingNote = false;
        };
        scope.cancelAddNote = function() {
          scope.note = '';
          return addingNote = false;
        };
        scope.getMilestones = function(progression) {
          var branch, i, j, len, len1, milestone, output, ref;
          output = [];
          ref = progression.milestones;
          for (i = 0, len = ref.length; i < len; i++) {
            branch = ref[i];
            for (j = 0, len1 = branch.length; j < len1; j++) {
              milestone = branch[j];
              output.push(milestone);
            }
          }
          return output;
        };
        findByValue = function(value, list, valField) {
          var i, item, len;
          for (i = 0, len = list.length; i < len; i++) {
            item = list[i];
            if (item[valField || '_id'] === value) {
              return item;
            }
          }
          return {};
        };
        scope.addAction = function(action) {
          if (action.type === 'Trigger') {
            action.name = action.triggerAction || 'Start milestone';
          } else {
            action.name = findByValue(action.template, (action.type === 'Email' ? scope.emailTemplates.items : scope.smsTemplates.items), '_id').name;
          }
          if (!action._id) {
            action._id = scope.generateId(8);
            scope.getData().actions.push(action);
          }
          scope.action = null;
          return scope.editingAction = false;
        };
        scope.editAction = function(action) {
          scope.action = action;
          return scope.editingAction = true;
        };
        scope.cancelAction = function() {
          scope.action = null;
          return scope.editingAction = false;
        };
        scope.reset = LettingsProgressionPopup.reset;
        deregister = $rootScope.$on('set-date', function(e, date) {
          var ref;
          if (scope.auth.checkRoles(['superadmin', 'admin'])) {
            return LettingsProgressionPopup.setDate(date);
          } else {
            return scope.modal({
              template: require('../../modals/advance-progression/advance-progression.html').default,
              controller: 'lettingsAdvanceProgressionCtrl',
              data: {
                advanceTo: date,
                milestone: scope.getData(),
                property: objtrans((ref = LettingsProgressionPopup.getProperty()) != null ? ref.item : void 0, {
                  roleId: 'RoleId',
                  displayAddress: true,
                  advanceRequests: '$case.item.advanceRequests',
                  progressions: '$case.item.progressions'
                })
              }
            }, $http.sites["lettings"].config).then(function() {
              return alert.log('Request submitted');
            }, function() {
              return false;
            });
          }
        });
        return scope.$on('$destroy', function() {
          return deregister();
        });
      }
    };
  });

}).call(this);
