// Generated by CoffeeScript 2.5.1
(function() {
  (function($angular, $moment, _, Hammer) {
    'use strict';
    $angular.module('maintenance-leads-date-swiper', []).directive('tap', [
      function() {
        return function(scope,
      element,
      attr) {
          var hammerTap;
          hammerTap = new Hammer(element[0],
      {});
          hammerTap.on('tap',
      function(ev) {
            scope.$event = ev;
            scope.$apply(function() {
              scope.$eval(attr.tap);
            });
          });
        };
      }
    ]).directive('maintenanceLeadsDateSwiper', [
      '$rootScope',
      '$timeout',
      function($rootScope,
      $timeout) {
        var me;
        me = {};
        me.dFormat = 'YYYY-MM-DD';
        me.today = $moment().format(me.dFormat);
        me._buildDayObject = function(y,
      m,
      d) {
          var _d;
          _d = $moment([y,
      m,
      d]);
          return {
            num: _d.date(),
            date: _d.format(me.dFormat),
            weekday: _d.weekday(),
            month: m
          };
        };
        me._calendarData = function(date) {
          var _key,
      _n,
      _nd,
      _nsd,
      _p,
      _pd,
      _pi,
      _pj,
      _t,
      d,
      nd,
      pd;
          _key = $moment(date).startOf('month');
          // setup 'current' month days
          d = [];
          d = _.times(_key.daysInMonth(),
      function(n) {
            return me._buildDayObject(_key.year(),
      _key.month(),
      n + 1);
          });
          // setup prev month backfill days
          _p = $moment(_key).subtract(1,
      'month');
          _pd = [];
          pd = [];
          _pi = 0;
          _pj = _p.daysInMonth();
          while (_pi < _key.isoWeekday()) {
            _pd.unshift(_pj);
            _pi++;
            _pj--;
          }
          pd = _.times(_pd.length,
      function(i) {
            return me._buildDayObject(_p.year(),
      _p.month(),
      _pd[i]);
          });
          // setup next month postfill days
          _n = $moment(_key).add(1,
      'month');
          _nsd = 1;
          _t = 0;
          _nd = [];
          nd = [];
          _t = d.length + _pd.length;
          while (_t % 14 !== 0) {
            _nd.push(_nsd);
            _nsd++;
            _t++;
          }
          nd = _.times(_nd.length,
      function(i) {
            return me._buildDayObject(_n.year(),
      _n.month(),
      _nd[i]);
          });
          return {
            days: pd.concat(d).concat(nd),
            year: _key.year(),
            month: _key.month(),
            monthName: _key.format('MMMM')
          };
        };
        // construct calendar data for 3 months: current/given month, previous, and next
        me._generateMonths = function(date) {
          var m;
          m = [];
          date = $moment(date).isValid() ? $moment(date).valueOf() : $moment().valueOf();
          m.push(me._calendarData($moment(date).subtract(1,
      'month')));
          m.push(me._calendarData($moment(date)));
          m.push(me._calendarData($moment(date).add(1,
      'month')));
          return m;
        };
        me._tryFuzzyDates = function(date) {
          if (date === 'today') {
            date = me.today;
          } else if (date === 'tomorrow') {
            date = $moment(me.today).add(1,
      'day');
          } else if (date === 'yesterday') {
            date = $moment(me.today).subtract(1,
      'day');
          }
          return date;
        };
        me._setActiveDate = function(date) {
          date = me._tryFuzzyDates(date);
          if ($moment(date).isValid()) {
            return $moment(date).format(me.dFormat);
          } else {
            return null;
          }
        };
        return {
          restrict: 'E',
          replace: true,
          scope: {
            config: '=?',
            date: '=?'
          },
          template: require("./date-swiper.html").default,
          link: function(scope,
      element) {
            var _calculateSnapPoint,
      _setMonths,
      _snaps,
      carousel,
      d,
      hammerSwiper,
      init,
      signature,
      swiper,
      x,
      y;
            signature = scope.config.prefix || 'date-swiper';
            swiper = $angular.element(element[0]);
            carousel = $angular.element(element[0].querySelector('.carousel'));
            hammerSwiper = new Hammer(swiper[0]);
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
              var diff,
      key,
      min,
      value;
              diff = void 0;
              // difference between pos and snap value
              min = void 0;
              // smallest difference
              key = void 0;
              // best snap key
              value = void 0;
              // best snap value
              // loop to find smallest diff, it is closest to the pos
              _.times(3,
      function(n) {
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
            _setMonths = function(snap) {
              var _c;
              _c = scope.months[snap.key];
              carousel.removeClass('dragging').addClass('animate').css({
                transform: 'translate3d(' + snap.value + '%, 0, 0)'
              });
              // center active date, regenerate calendars
              if (snap.key !== 1) {
                $timeout((function() {
                  scope.months = me._generateMonths($moment([_c.year,
      _c.month]).valueOf());
                  scope.snap = _snaps[1];
                  carousel.removeClass('animate').css({
                    transform: 'translate3d(' + scope.snap.value + '%, 0, 0)'
                  });
                }),
      300);
              }
            };
            // STUFF ON SCOPE
            // user clicks date to make it "active"
            scope.setDate = function(date) {
              scope.date = me._setActiveDate(date);
              scope.months = me._generateMonths(scope.date);
              _setMonths(scope.snap);
              $rootScope.$emit(signature + ':date-tap',
      scope.date);
            };
            // Calculate the classes for the calendar items.
            scope.setClass = function(day,
      month) {
              var classes;
              classes = [];
              if (day.date === scope.date) {
                classes.push('is-selected');
              }
              if (day.date === me.today) {
                classes.push('is-today');
              }
              if (day.weekday === 0 || day.weekday === 6) {
                classes.push('is-weekend');
              }
              if (day.month === month.month) {
                classes.push('day-in-curr-month');
              }
              return classes.join(' ');
            };
            scope.toggle = function() {
              scope.config.show = !scope.config.show;
            };
            scope.monthPrev = function() {
              scope.snap = {
                key: 0,
                value: 0
              };
              return _setMonths(scope.snap);
            };
            scope.monthNext = function() {
              scope.snap = {
                key: 2,
                value: -200
              };
              return _setMonths(scope.snap);
            };
            scope.done = function() {
              $rootScope.$emit('set-date',
      scope.date);
              return scope.config.show = false;
            };
            // HAMMER TIME
            hammerSwiper.get('pan').set({
              direction: Hammer.DIRECTION_ALL,
              threshold: 0
            });
            hammerSwiper.on('panstart',
      function() {
              carousel.addClass('dragging').removeClass('animate');
              swiper.addClass('dragging');
            }).on('panleft panright panup pandown',
      function(e) {
              d = Math.abs(parseInt(e.deltaX)) > Math.abs(parseInt(e.deltaY)) ? 'x' : 'y';
              x = scope.snap.value + parseInt(e.deltaX) / element[0].clientWidth * 100 * scope.mod;
              y = parseInt(e.deltaY) / element[0].clientHeight * 100 * scope.mod;
              y = y < 0 ? 0 : y;
              if (d === 'x') {
                carousel.css({
                  transform: 'translate3d(' + x + '%, 0, 0)'
                });
              }
            /*
            else
              swiper.css transform: 'translate3d(0, ' + y + '%, 0)'
            */
            }).on('panend',
      function() {
              swiper.removeClass('dragging').css({
                transform: ''
              });
              if (d === 'x') {
                scope.snap = _calculateSnapPoint(x);
                _setMonths(scope.snap);
              }
              /*
              if d == 'y' and y > 35
                scope.toggle()
              */
              scope.$apply();
            });
            // LISTEN FOR THINGS
            $rootScope.$on(signature + ':set',
      function(e,
      date) {
              scope.setDate(date);
            });
            $rootScope.$on(signature + ':show',
      function(e,
      date) {
              scope.config.show = true;
              scope.setDate(date);
            });
            $rootScope.$on(signature + ':hide',
      function() {
              scope.config.show = false;
            });
            // DO THINGS
            init = function(date) {
              scope.dayNames = ['Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'];
              scope.mod = parseFloat(scope.config.modifier) < 0.75 ? 0.75 : parseFloat(scope.config.modifier);
              scope.snap = _snaps[1];
              scope.setDate(date);
            };
            init(scope.date);
          }
        };
      }
    ]);
  })(window.angular, window.moment, window._, window.Hammer);

  // ---
// generated by js2coffee 2.2.0

}).call(this);
