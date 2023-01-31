// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').directive('calendar', function($timeout, $filter, $rootScope, $stateParams, TaskPopup) {
    return {
      restrict: 'EA',
      template: require("./calendar.html").default,
      replace: true,
      link: function(scope, elem, attrs) {
        var _calculateSnapPoint, _snaps, carousel, d, dayOffset, daysToShow, deref, generateData, getTasks, hammerSwiper, makeWeek, mapTasksToDays, resize, selectedDate, snapTo, startDate, swiper, x, y;
        dayOffset = 7;
        daysToShow = 7;
        if (window.innerWidth < 820) {
          dayOffset = 1;
          daysToShow = 1;
        }
        resize = function() {
          dayOffset = 7;
          daysToShow = 7;
          if (window.innerWidth < 820) {
            dayOffset = 1;
            daysToShow = 1;
          }
          return $timeout(function() {
            return generateData(scope.startDate);
          });
        };
        window.addEventListener('resize', resize);
        mapTasksToDays = function() {
          var day, dayDate, k, len, ref, results, task, taskDate, week;
          if (scope.tasks && scope.tasks.items) {
            ref = scope.weeks;
            results = [];
            for (k = 0, len = ref.length; k < len; k++) {
              week = ref[k];
              results.push((function() {
                var l, len1, ref1, results1;
                ref1 = week.days;
                results1 = [];
                for (l = 0, len1 = ref1.length; l < len1; l++) {
                  day = ref1[l];
                  day.tasks = [];
                  results1.push((function() {
                    var len2, m, ref2, results2;
                    ref2 = scope.tasks.items;
                    results2 = [];
                    for (m = 0, len2 = ref2.length; m < len2; m++) {
                      task = ref2[m];
                      taskDate = new Date(task.date);
                      if (day.day.getDate() === taskDate.getDate() && day.day.getMonth() === taskDate.getMonth() && day.day.getFullYear() === taskDate.getFullYear()) {
                        task.date = taskDate;
                        dayDate = new Date(day.day.getFullYear(), day.day.getMonth(), day.day.getDate(), 9);
                        task.top = (taskDate.valueOf() - dayDate.valueOf()) / 3600000 * 6;
                        task.height = task.duration / 3600000 * 6;
                        task.offset = day.tasks.filter(function(item) {
                          return item.top === task.top;
                        }).length;
                        results2.push(day.tasks.push(task));
                      } else {
                        results2.push(void 0);
                      }
                    }
                    return results2;
                  })());
                }
                return results1;
              })());
            }
            return results;
          }
        };
        scope.calculateDailyIncome = function(day) {
          var k, len, output, ref, task, taskDate;
          output = {
            amount: 0,
            target: 130,
            profitloss: 0
          };
          if (scope.tasks && scope.tasks.items) {
            ref = $filter('filter')(scope.tasks.items, scope.selectedMLUser);
            for (k = 0, len = ref.length; k < len; k++) {
              task = ref[k];
              if (task.status === 'confirmed' || task.status === 'completed') {
                taskDate = new Date(task.date);
                if (day.getDate() === taskDate.getDate() && day.getMonth() === taskDate.getMonth() && day.getFullYear() === taskDate.getFullYear()) {
                  output.amount += +(task.cost || 0);
                }
              }
            }
          }
          output.profitloss = output.amount - output.target;
          return output;
        };
        scope.calculateWeeklyIncome = function() {
          var k, len, output, ref, ref1, task, taskDate, weekEnd, weekStart;
          weekStart = startDate;
          output = {
            amount: 0,
            target: 5 * 130,
            profitloss: 0,
            jobs: 0,
            quotes: 0
          };
          weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7);
          if (scope.tasks && scope.tasks.items) {
            ref = $filter('filter')(scope.tasks.items, scope.selectedMLUser);
            for (k = 0, len = ref.length; k < len; k++) {
              task = ref[k];
              taskDate = new Date(task.date);
              if ((weekStart.valueOf() < (ref1 = taskDate.valueOf()) && ref1 < weekEnd.valueOf())) {
                output.jobs++;
                if (task.status === 'confirmed' || task.status === 'completed') {
                  output.amount += +(task.cost || 0);
                } else if (task.status === 'quote') {
                  output.quotes++;
                }
              }
            }
          }
          output.profitloss = output.amount - output.target;
          return output;
        };
        scope.tasks = {
          items: []
        };
        scope.allTasks = scope.list('maintenance_leads:tasks', {
          where: {
            dateVal: {$gt:new Date('2022-12-20').valueOf()}
          }
        }, function() {
          return scope.issues = scope.list('maintenance_leads:issues', {
            where: {
              statusName: 'Booked'
            }
          }, function() {
            return scope.filterTasks();
          });
        });
        scope.filterTasks = function() {
          var k, len, ref, ref1, ref2, task;
          scope.tasks.items = scope.allTasks.items.filter(function(task) {
            if (scope.onlyThisIssue) {
              return (scope.onlyThisIssue && scope.issue.item._id === task.issue) && (!scope.selectedContractors || !scope.selectedContractors.length || scope.selectedContractors.includes(task.contractor));
            } else {
              return !scope.selectedContractors || !scope.selectedContractors.length || scope.selectedContractors.includes(task.contractor);
            }
          });
          ref = scope.tasks.items;
          for (k = 0, len = ref.length; k < len; k++) {
            task = ref[k];
            [task.currentIssue] = (ref1 = scope.issues) != null ? (ref2 = ref1.items) != null ? ref2.filter(function(issue) {
              return issue._id === task.issue;
            }) : void 0 : void 0;
          }
          return mapTasksToDays();
        };
        getTasks = function(date, time) {
          var statuses, taskDate;
          date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9);
          statuses = ['confirmed', 'quote', 'completed'];
          taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time);
          return [
            {
              title: 'dgoijd godijg dsoigjds gjsdiogj dsojg sdoigj sdoigjsdoi gjodsigj sdiojgosdij gosdijg osdigj oijg osdijg osdigj ij g',
              date: taskDate,
              top: (taskDate.valueOf() - date.valueOf()) / 3600000 * 6,
              height: 3600000 / 3600000 * (3 * Math.floor(Math.random() * 6) + 3),
              status: statuses[Math.floor(Math.random() * statuses.length)],
              duration: 3600000
            }
          ];
        };
        scope.issue = scope.single('maintenance_leads:issues', $stateParams);
        scope.contractors = scope.list('maintenance_leads:contractors', {
          sort: 'name',
          sortDir: 'ASC'
        });
        scope.weeks = [];
        startDate = new Date();
        selectedDate = startDate;
        deref = $rootScope.$on('toolbar:date-tap', function(e, date) {
          startDate = new Date(date);
          selectedDate = startDate;
          while (startDate.getDay() !== 1) {
            startDate = new Date(startDate.valueOf() - 24 * 60 * 60 * 1000);
          }
          return generateData(startDate);
        });
        scope.$on('$destroy', function() {
          deref();
          return window.removeEventListener('resize', resize);
        });
        makeWeek = function(startDate) {
          var hours, i, j, week;
          week = {
            date: startDate,
            days: []
          };
          i = 0;
          while (i++ < daysToShow) {
            hours = [];
            startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 9);
            j = 0;
            while (j++ < 12) {
              hours.push(startDate);
              startDate = new Date(startDate.valueOf() + 60 * 60 * 1000);
            }
            week.days.push({
              day: startDate,
              tasks: [], //getTasks startDate, i + 9
              hours: hours
            });
            startDate = new Date(startDate.valueOf() + 24 * 60 * 60 * 1000);
          }
          return week;
        };
        generateData = function(startDate) {
          TaskPopup.hide();
          scope.startDate = startDate;
          scope.weeks = [makeWeek(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - dayOffset)), makeWeek(startDate), makeWeek(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + dayOffset))];
          return mapTasksToDays();
        };
        while (startDate.getDay() !== 1) {
          startDate = new Date(startDate.valueOf() - 24 * 60 * 60 * 1000);
        }
        $timeout(function() {
          return generateData(startDate);
        });
        scope.isSelected = function(day) {
          if (day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth() && day.getFullYear() === selectedDate.getFullYear()) {
            return true;
          }
          return false;
        };
        scope.openTask = function(task, ev) {
          var notasks, ref;
          if (TaskPopup.getHidden() && scope.issue.item._id) {
            notasks = scope.tasks.items.filter(function(task) {
              return task.issue === scope.issue.item._id;
            }).length;
            if (notasks > 0 && !task._id) {
              return;
            }
            task = task || {};
            task.duration = task.duration || 3600000;
            task.assignedTo = task.assignedTo || scope.selectedMLUser;
            task.status = task.status || {
              booked: true
            };
            task.createdDate = task.createdDate || new Date().valueOf();
            task.createdBy = task.createdBy || scope.auth.getUser();
            task.issue = task.issue || scope.issue.item._id;
            task.title = task.title || scope.issue.item.title;
            task.address = task.address || scope.issue.item.address;
            if (!task.contractor && ((ref = scope.selectedContractors) != null ? ref.length : void 0) === 1) {
              task.contractor = scope.selectedContractors[0];
            }
            return scope.modal({
              template: require('../../modals/task/task.html').default,
              controller: 'maintenance_leadsTaskCtrl',
              data: {
                task: task,
                cfpJobNumber: scope.issue.item.cfpJobNumber,
                needsJobNumber: !scope.issue.item.cfpJobNumber,
                contractors: scope.contractors.items.filter(function(contractor) {
                  return task._id || !scope.selectedContractors || !scope.selectedContractors.length || scope.selectedContractors.includes(contractor._id);
                })
              }
            }, $http.sites["maintenance_leads"].config).then(function(result) {
              return true;
            }, function(err) {
              return false;
            });
          } else {
            return TaskPopup.cancelBubble = false;
          }
        };
        //ev.stopPropagation()

        //swiper stuff
        swiper = angular.element(elem[0]);
        carousel = angular.element(elem[0].querySelector('.carousel'));
        hammerSwiper = new Hammer(elem[0]);
        d = void 0;
        x = 0;
        y = 0;
        _snaps = [
          {
            key: 0,
            value: 0
          },
          {
            key: 1,
            value: -100
          },
          {
            key: 2,
            value: -200
          }
        ];
        // get the snap location at 'panend' for where to animate the carousel
        _calculateSnapPoint = function(pos) {
          var diff, key, min, value;
          diff = void 0;
          // difference between pos and snap value
          min = void 0;
          // smallest difference
          key = void 0;
          // best snap key
          value = void 0;
          // best snap value
          // loop to find smallest diff, it is closest to the pos
          _.times(3, function(n) {
            var snap;
            snap = n > 0 ? n * -100 : 0;
            diff = Math.abs(pos - snap);
            if (_.isUndefined(min) || diff < min) {
              min = diff;
              key = n;
              value = snap;
            }
          });
          return {
            key: key,
            value: value
          };
        };
        scope.prev = function() {
          scope.snap = {
            key: 0,
            value: 0
          };
          return snapTo();
        };
        scope.next = function() {
          scope.snap = {
            key: 2,
            value: -200
          };
          return snapTo();
        };
        scope.goToToday = function() {
          startDate = new Date();
          selectedDate = startDate;
          while (startDate.getDay() !== 1) {
            startDate = new Date(startDate.valueOf() - 24 * 60 * 60 * 1000);
          }
          return generateData(startDate);
        };
        snapTo = function() {
          carousel.removeClass('dragging').addClass('animate').css({
            transform: 'translate3d(' + scope.snap.value + '%, 0, 0)'
          });
          if (scope.snap.key !== 1) {
            return $timeout(function() {
              if (scope.snap.key === 0) {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - dayOffset);
              }
              if (scope.snap.key === 2) {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + dayOffset);
              }
              generateData(startDate);
              scope.snap = _snaps[1];
              return carousel.removeClass('animate').css({
                transform: 'translate3d(' + scope.snap.value + '%, 0, 0)'
              });
            }, 300);
          }
        };
        // HAMMER TIME
        hammerSwiper.get('pan').set({
          direction: Hammer.DIRECTION_HORIZONTAL,
          threshold: 0
        });
        hammerSwiper.on('panstart', function() {
          carousel.addClass('dragging').removeClass('animate');
          swiper.addClass('dragging');
        }).on('panleft panright', function(e) {
          d = Math.abs(parseInt(e.deltaX)) > Math.abs(parseInt(e.deltaY)) ? 'x' : 'y';
          x = scope.snap.value + parseInt(e.deltaX) / elem[0].clientWidth * 100 * scope.mod;
          y = parseInt(e.deltaY) / elem[0].clientHeight * 100 * scope.mod;
          y = 0; //if y < 0 then 0 else y
          if (d === 'x') {
            carousel.css({
              transform: 'translate3d(' + x + '%, 0, 0)'
            });
          } else {
            swiper.css({
              transform: 'translate3d(0, ' + y + '%, 0)'
            });
          }
        }).on('panend', function() {
          swiper.removeClass('dragging').css({
            transform: ''
          });
          if (d === 'x') {
            scope.snap = _calculateSnapPoint(x);
            //_setMonths scope.snap
            //scope.snap = _snaps[1]
            snapTo();
          }
          scope.$apply();
        });
        scope.mod = 1.5;
        scope.snap = _snaps[1];
        return carousel.css({
          transform: 'translate3d(' + scope.snap.value + '%, 0, 0)'
        });
      }
    };
  });

}).call(this);
