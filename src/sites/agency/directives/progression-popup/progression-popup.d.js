// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-agency').directive('agencyProgressionPopup', function($rootScope, $timeout, AgencyProgressionPopup, alert) {
    return {
      restrict: 'AE',
      template: require("./progression-popup.html").default,
      replace: true,
      scope: {},
      link: function(scope, elem) {
        var addingNote, deregister, findByValue, getDateDiff, templateDeref;
        AgencyProgressionPopup.setScope(scope);
        addingNote = false;
        scope.action = null;
        scope.editorState = '';
        scope.icons = ['cathead', 'house', 'epc', 'instruction', 'draft', 'fandf', 'survey', 'offer', 'raised', 'satisfied', 'applied', 'complete', 'report', 'exchange', 'invoice', 'completion'];
        scope.contactOptions = [
          {
            id: 'purchasersContact',
            name: 'Purchaser'
          },
          {
            id: 'vendorsContact',
            name: 'Vendor'
          },
          {
            id: 'purchasersSolicitor',
            name: 'Purchaser\'s solicitor'
          },
          {
            id: 'vendorsSolicitor',
            name: 'Vendor\'s solicitor'
          },
          {
            id: 'negotiator',
            name: 'Negotiator'
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
        templateDeref = scope.$watch(function() {
          return scope.auth.getUser();
        }, function(n) {
          if (n) {
            scope.emailTemplates = scope.list('agency:emailtemplates');
            scope.smsTemplates = scope.list('agency:smstemplates');
            return templateDeref();
          }
        });
        scope.getData = AgencyProgressionPopup.getData;
        scope.getTitle = AgencyProgressionPopup.getTitle;
        scope.setCompleted = AgencyProgressionPopup.setCompleted;
        scope.getCompleted = AgencyProgressionPopup.getCompleted;
        scope.getCompletedTime = AgencyProgressionPopup.getCompletedTime;
        scope.getProgressing = AgencyProgressionPopup.getProgressing;
        scope.getHidden = AgencyProgressionPopup.getHidden;
        scope.getNotes = AgencyProgressionPopup.getNotes;
        scope.hide = AgencyProgressionPopup.hide;
        scope.getProgressions = AgencyProgressionPopup.getProgressions;
        scope.getDate = AgencyProgressionPopup.getDate;
        scope.setDate = function() {
          return $rootScope.$emit('swiper:show', AgencyProgressionPopup.getDate());
        };
        scope.setProgressing = function() {
          return AgencyProgressionPopup.setProgressing();
        };
        getDateDiff = function(startDate, endDate) {
          var end, nodays, start;
          end = moment(endDate);
          start = moment(startDate).startOf('day');
          nodays = end.diff(start, 'days');
          return nodays + (nodays === 1 ? ' day' : ' days');
        };
        scope.getEstDays = function() {
          return AgencyProgressionPopup.getEstDays();
        };
        scope.isStart = function() {
          var title;
          title = AgencyProgressionPopup.getTitle();
          return title === 'Start';
        };
        scope.addNote = function() {
          return addingNote = true;
        };
        scope.addingNote = function() {
          return addingNote;
        };
        scope.doAddNote = function() {
          AgencyProgressionPopup.addNote(scope.note);
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
        scope.reset = AgencyProgressionPopup.reset;
        deregister = $rootScope.$on('set-date', function(e, date) {
          var ref;
          if (scope.auth.checkRoles(['superadmin', 'admin'])) {
            return AgencyProgressionPopup.setDate(date);
          } else {
            return scope.modal({
              template: require('../../modals/advance-progression/advance-progression.html').default,
              controller: 'agencyAdvanceProgressionCtrl',
              data: {
                advanceTo: date,
                milestone: scope.getData(),
                property: objtrans((ref = AgencyProgressionPopup.getProperty()) != null ? ref.item : void 0, {
                  roleId: 'RoleId',
                  displayAddress: true,
                  advanceRequests: '$case.item.advanceRequests',
                  progressions: '$case.item.progressions'
                })
              }
            }, $http.sites["agency"].config).then(function() {
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
