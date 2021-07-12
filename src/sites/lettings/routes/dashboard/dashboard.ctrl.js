// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-lettings').directive('lettingsDashboard', function($filter, $timeout, env) {
    return {
      template: require("./dashboard.html").default,
      scope: {},
      link: (scope) => {
        var bmonth, i, month, monthNames, now;
        scope.propsOpts = {
          where: {
            delisted: false
          }
        };
        scope.properties = scope.list('lettings:properties', {
          where: {
            Status: 'OfferAccepted',
            delisted: false
          }
        }, function(properties) {
          var completeBeforeDelisted, i, milestone, progression, property, results;
          i = properties.items.length;
          results = [];
          while (i-- > 0) {
            property = properties.items[i];
            if (property.override && property.override.deleted) {
              properties.items.splice(i, 1);
              continue;
            }
            completeBeforeDelisted = false;
            if (property.progressions && property.progressions.length) {
              progression = property.progressions[0];
              milestone = progression.milestones[progression.milestones.length - 1];
              completeBeforeDelisted = (!milestone[0].completed && property.delisted) || !property.delisted;
            }
            results.push(property.completeBeforeDelisted = completeBeforeDelisted);
          }
          return results;
        });
        scope.availableOpts = {
          where: {
            RoleStatus: 'InstructionToLet',
            RoleType: 'Letting',
            IncludeStc: true
          },
          transform: {
            items: 'Collection',
            total: 'TotalCount'
          }
        };
        scope.available = scope.list({
          route: `${env.PROPERTY_URL}/search`
        }, scope.availableOpts);
        scope.dashboard = scope.list('lettings:dashboard', {
          sort: 'i'
        });
        scope.buyerProgression = null;
        scope.progressions = scope.list('lettings:progressions', null, function(progressions) {
          var j, len, progression, ref, results;
          ref = progressions.items;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            progression = ref[j];
            if (progression.side === 'Tenant') {
              results.push(scope.buyerProgression = progression);
            } else {
              results.push(void 0);
            }
          }
          return results;
        });
        scope.count = function(di, list) {
          var b, branch, count, j, k, l, len, len1, len2, len3, len4, len5, len6, m, maxIndex, milestone, minIndex, n, o, output, p, progression, property, propertyGood, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
          output = [];
          count = 0;
          minIndex = 0;
          maxIndex = 100;
          if (scope.properties && scope.properties.items && scope.progressions && scope.progressions.items) {
            ref = scope.progressions.items;
            for (j = 0, len = ref.length; j < len; j++) {
              progression = ref[j];
              if (progression._id === di.progression) {
                ref1 = progression.milestones;
                for (b = k = 0, len1 = ref1.length; k < len1; b = ++k) {
                  branch = ref1[b];
                  for (l = 0, len2 = branch.length; l < len2; l++) {
                    milestone = branch[l];
                    if (milestone._id === di.minms) {
                      minIndex = b;
                    }
                    if (milestone._id === di.maxms) {
                      maxIndex = b;
                      break;
                    }
                  }
                }
              }
            }
            ref2 = scope.properties.items;
            for (m = 0, len3 = ref2.length; m < len3; m++) {
              property = ref2[m];
              if (property && property.milestoneIndex && angular.isDefined(property.milestoneIndex[di.progression])) {
                if ((ref3 = property.override) != null ? ref3.deleted : void 0) {
                  continue;
                }
                if ((minIndex <= (ref4 = property.milestoneIndex[di.progression]) && ref4 <= maxIndex)) {
                  propertyGood = true;
                  if (di.min && di.max) {
                    propertyGood = false;
                    ref5 = property.progressions;
                    for (n = 0, len4 = ref5.length; n < len4; n++) {
                      progression = ref5[n];
                      if (progression._id === di.progression) {
                        ref6 = progression.milestones;
                        for (o = 0, len5 = ref6.length; o < len5; o++) {
                          branch = ref6[o];
                          for (p = 0, len6 = branch.length; p < len6; p++) {
                            milestone = branch[p];
                            if (milestone._id === di.minms || milestone._id === di.maxms) {
                              if ((di.min <= (ref7 = milestone.estCompletedTime) && ref7 <= di.max)) {
                                propertyGood = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  if (propertyGood) {
                    if (list) {
                      output.push(property);
                    }
                    count++;
                  }
                }
              }
            }
          }
          if (list) {
            return output;
          } else {
            return count;
          }
        };
        scope.total = function(items) {
          var item, j, len, total;
          total = 0;
          if (items) {
            for (j = 0, len = items.length; j < len; j++) {
              item = items[j];
              total += scope.count(item);
            }
          }
          return total;
        };
        scope.income = function(di, month, list) {
          var branch, count, j, k, l, len, len1, len2, len3, m, milestone, output, progression, property, ref, ref1, ref2, ref3, ref4, value;
          count = 0;
          output = [];
          if (scope.properties && scope.properties.items) {
            ref = scope.properties.items;
            for (j = 0, len = ref.length; j < len; j++) {
              property = ref[j];
              if ((ref1 = property.override) != null ? ref1.deleted : void 0) {
                continue;
              }
              if (property && property.progressions && property.completeBeforeDelisted) {
                ref2 = property.progressions;
                for (k = 0, len1 = ref2.length; k < len1; k++) {
                  progression = ref2[k];
                  if (progression._id === di.progression) {
                    ref3 = progression.milestones;
                    for (l = 0, len2 = ref3.length; l < len2; l++) {
                      branch = ref3[l];
                      for (m = 0, len3 = branch.length; m < len3; m++) {
                        milestone = branch[m];
                        if (milestone._id === di.minms) {
                          if ((month.start <= (ref4 = milestone.estCompletedTime) && ref4 <= month.end)) {
                            value = 0;
                            if (di.status === 'Due') {
                              if (!milestone.completed) {
                                value += property.role.Commission;
                              }
                            }
                            if (di.status === 'Completed') {
                              if (milestone.completed) {
                                value += property.role.Commission;
                              }
                            }
                            if (di.status === 'Started') {
                              if (milestone.started && !milestone.completed) {
                                value += property.role.Commission;
                              }
                            }
                            if (di.sumtype === 'Income') {
                              count += value;
                            } else {
                              if (value) {
                                count++;
                              }
                            }
                            if (value && list) {
                              output.push(property);
                            }
                            break;
                          }
                        }
                      }
                    }
                    break;
                  }
                }
              }
            }
          }
          if (list) {
            return output;
          } else if (di.sumtype === 'Income') {
            return $filter('currency')(count, '£', 2);
          } else {
            return count;
          }
        };
        scope.showInfo = function(type, di, month) {
          var list;
          list = null;
          if (type === 'count') {
            list = scope.count(di, true);
          } else {
            list = scope.income(di, month, true);
          }
          if (list.length) {
            return scope.modal({
              template: 'dashboard-income',
              controller: 'lettingsDashboardIncomeCtrl',
              data: {
                di: di,
                month: month,
                list: list
              }
            }).then(function() {
              return true;
            }, function() {
              return false;
            });
          }
        };
        monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        scope.months = [];
        now = new Date();
        bmonth = new Date(now.getFullYear(), now.getMonth() - 1);
        scope.allmonths = {
          start: bmonth.valueOf(),
          end: 0
        };
        i = 0;
        while (i++ < 5) {
          month = {
            name: monthNames[bmonth.getMonth()],
            start: bmonth.valueOf(),
            end: 0
          };
          bmonth.setMonth(bmonth.getMonth() + 1);
          month.end = bmonth.valueOf() - 1;
          scope.months.push(month);
        }
        return scope.allmonths.end = bmonth.valueOf();
      }
    }
  });

}).call(this);
