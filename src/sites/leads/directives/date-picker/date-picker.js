// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('ndx').provider('datePicker', function() {
    var fns, open;
    open = false;
    fns = [];
    return {
      $get: function() {
        return {
          setOpen: function(val) {
            return open = val;
          },
          isOpen: function() {
            return open;
          },
          add: function(closeFn) {
            return fns.push(closeFn);
          },
          remove: function(closeFn) {
            return fns.splice(fns.indexOf(closeFn), 1);
          },
          clear: function() {
            return fns = [];
          },
          closeAll: function() {
            var fn, j, len;
            for (j = 0, len = fns.length; j < len; j++) {
              fn = fns[j];
              fn();
            }
            return fns = [];
          }
        };
      }
    };
  }).directive('datePicker', function($document, $templateCache, $compile, $timeout, $filter, $window, datePicker) {
    return {
      restrict: 'AE',
      require: 'ngModel',
      template: '<div class="input-holder"><input name="{{name}}" date-input class="date-picker-input" ng-model="ngModel" min="{{min}}" max="{{max}}" ng-required="{{required}}" title="{{placeholder}}" placeholder="{{placeholder}}" ng-blur="change()" /><button ng-click="open()" type="button"><i class="icon calendar"></i></button></div>',
      replace: true,
      scope: {
        ngModel: '=',
        dateFormat: '@',
        anchor: '@',
        placeholder: '@',
        closeOnSelect: '@',
        required: '@',
        name: '@',
        min: '@',
        max: '@',
        change: '='
      },
      link: function(scope, elem, attrs, ctrl) {
        var _calculateSnapPoint, _setMonths, _snaps, body, carousel, customClasses, d, el, generateYears, getOffset, hammerSwiper, init, keyDown, me, modifier, noYears, original, setPos, setValidity, swiper, swiperBox, x, y, yearPointer;
        customClasses = elem[0].className.replace(/date-picker-input|ng.*/g, '').trim();
        scope.dateFormat = scope.dateFormat || scope.mediumDate || scope.$root.mediumDate || 'mediumDate';
        scope.mode = 'date';
        scope.toggleMode = function() {
          scope.setDate(scope.date);
          return scope.mode = scope.mode === 'date' ? 'year' : 'date';
        };
        me = {};
        me.dFormat = 'YYYY-MM-DD';
        me.today = moment().format(me.dFormat);
        me._buildDayObject = function(y, m, d) {
          var _d;
          _d = moment([y, m, d]);
          return {
            num: _d.date(),
            date: _d.format(me.dFormat),
            weekday: _d.weekday(),
            month: m
          };
        };
        me._calendarData = function(date) {
          var _key, _n, _nd, _nsd, _p, _pd, _pi, _pj, _t, d, nd, pd;
          _key = moment(date).startOf('month');
          // setup 'current' month days
          d = [];
          d = _.times(_key.daysInMonth(), function(n) {
            return me._buildDayObject(_key.year(), _key.month(), n + 1);
          });
          // setup prev month backfill days
          _p = moment(_key).subtract(1, 'month');
          _pd = [];
          pd = [];
          _pi = 0;
          _pj = _p.daysInMonth();
          while (_pi < _key.isoWeekday()) {
            _pd.unshift(_pj);
            _pi++;
            _pj--;
          }
          pd = _.times(_pd.length, function(i) {
            return me._buildDayObject(_p.year(), _p.month(), _pd[i]);
          });
          // setup next month postfill days
          _n = moment(_key).add(1, 'month');
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
          nd = _.times(_nd.length, function(i) {
            return me._buildDayObject(_n.year(), _n.month(), _nd[i]);
          });
          return {
            days: pd.concat(d).concat(nd),
            year: _key.year(),
            month: _key.month(),
            monthName: _key.format('MMMM')
          };
        };
        me._generateMonths = function(date) {
          var m;
          m = [];
          date = moment(date).isValid() ? moment(date).valueOf() : moment().valueOf();
          m.push(me._calendarData(moment(date).subtract(1, 'month')));
          m.push(me._calendarData(moment(date)));
          m.push(me._calendarData(moment(date).add(1, 'month')));
          return m;
        };
        me._tryFuzzyDates = function(date) {
          if (date === 'today') {
            date = me.today;
          } else if (date === 'tomorrow') {
            date = moment(me.today).add(1, 'day');
          } else if (date === 'yesterday') {
            date = moment(me.today).subtract(1, 'day');
          }
          return date;
        };
        modifier = 2.5;
        swiper = null;
        carousel = null;
        hammerSwiper = null;
        swiperBox = null;
        original = null;
        d = void 0;
        x = 0;
        y = 0;
        scope.mod = 4;
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
        if (head.mobile) {
          scope.mod = 1.4;
        }
        // get the snap location at 'panend' for where to animate the carousel
        _calculateSnapPoint = function(pos) {
          var diff, key, min, snapVal, value;
          diff = void 0;
          // difference between pos and snap value
          min = void 0;
          // smallest difference
          key = void 0;
          // best snap key
          value = void 0;
          // best snap value
          // loop to find smallest diff, it is closest to the pos
          snapVal = -100;
          //if head.browser.ie
          //  snapVal = -33.3333
          _.times(3, function(n) {
            var snap;
            snap = n > 0 ? n * snapVal : 0;
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
        yearPointer = null;
        noYears = 15;
        generateYears = function() {
          var i, j, len, month, ref, results, startYear;
          startYear = yearPointer - Math.floor(noYears / 2) - noYears;
          ref = scope.months;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            month = ref[j];
            month.years = [];
            i = 0;
            results.push((function() {
              var results1;
              results1 = [];
              while (i++ < noYears) {
                results1.push(month.years.push(startYear++));
              }
              return results1;
            })());
          }
          return results;
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
              scope.months = me._generateMonths(moment([_c.year, _c.month]).valueOf());
              if (scope.mode === 'year') {
                if (snap.key === 0) {
                  yearPointer -= noYears;
                } else if (snap.key === 2) {
                  yearPointer += noYears;
                }
              }
              generateYears();
              scope.snap = _snaps[1];
              carousel.removeClass('animate').css({
                transform: 'translate3d(' + scope.snap.value + '%, 0, 0)'
              });
            }), 300);
          }
        };
        getOffset = function(elm) {
          var offset;
          offset = {
            left: 0,
            top: 0
          };
          while (elm && elm.tagName !== 'BODY') {
            if (elm.style.position !== 'fixed') {
              offset.left += elm.offsetLeft;
              offset.top += elm.offsetTop;
            } else {
              offset.left += elm.offsetLeft - (elm.clientWidth / 2);
              offset.top += elm.offsetTop;
            }
            elm = elm.offsetParent;
          }
          return offset;
        };
        scope.setDate = function(date, isTap) {
          scope.date = me._setActiveDate(date);
          yearPointer = new Date(scope.date).getFullYear();
          scope.months = me._generateMonths(scope.date);
          generateYears();
          _setMonths(scope.snap);
          scope.ngModel = new Date(scope.date).valueOf();
          setValidity();
          if (isTap && scope.closeOnSelect) {
            scope.done();
          }
        };
        scope.setYear = function(year) {
          if (new Date(scope.date).getFullYear() !== year) {
            scope.date = `${year}-01-01`;
          }
          scope.setDate(scope.date);
          return scope.mode = 'date';
        };
        // Calculate the classes for the calendar items.
        scope.setClass = function(day, month) {
          var classes, date, max, min;
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
          date = new Date(day.date);
          date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          date.setHours(9);
          if (attrs.min) {
            if (/^\d+$/.test(attrs.min)) {
              attrs.min = +attrs.min;
            }
            min = new Date(attrs.min);
            min.setHours(0);
            if (date.valueOf() < min.valueOf()) {
              classes.push('invalid');
              classes.push('before');
            }
          }
          if (attrs.max) {
            if (/^\d+$/.test(attrs.max)) {
              attrs.max = +attrs.max;
            }
            max = new Date(attrs.max);
            date.setHours(0);
            if (date.valueOf() > max.valueOf()) {
              classes.push('invalid');
              classes.push('after');
            }
          }
          return classes.join(' ');
        };
        scope.monthPrev = function() {
          scope.snap = {
            key: 0,
            value: 0
          };
          return _setMonths(scope.snap);
        };
        scope.monthNext = function() {
          scope.snap = _snaps[2];
          return _setMonths(scope.snap);
        };
        setValidity = function() {
          var date, max, min;
          if (scope.ngModel === original) {
            return;
          }
          date = new Date(+scope.ngModel);
          date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          date.setHours(9);
          if (attrs.min) {
            if (/^\d+$/.test(attrs.min)) {
              attrs.min = +attrs.min;
            }
            min = new Date(attrs.min);
            ctrl.$setValidity('min', date.valueOf() >= min.valueOf());
          }
          if (attrs.max) {
            if (/^\d+$/.test(attrs.max)) {
              attrs.max = +attrs.max;
            }
            max = new Date(attrs.max);
            return ctrl.$setValidity('max', date.valueOf() <= max.valueOf());
          }
        };
        init = function(date) {
          // HAMMER TIME
          hammerSwiper.get('pan').set({
            direction: Hammer.DIRECTION_ALL,
            threshold: 0
          });
          hammerSwiper.on('panstart', function() {
            carousel.addClass('dragging').removeClass('animate');
            swiper.addClass('dragging');
          }).on('panleft panright panup pandown', function(e) {
            d = Math.abs(parseInt(e.deltaX)) > Math.abs(parseInt(e.deltaY)) ? 'x' : 'y';
            x = scope.snap.value + parseInt(e.deltaX) / el[0].clientWidth * 100 * scope.mod;
            y = parseInt(e.deltaY) / el[0].clientHeight * 100 * scope.mod;
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
          }).on('panend', function() {
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
          scope.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          scope.snap = _snaps[1];
          scope.setDate(date);
          original = scope.ngModel;
        };
        me._setActiveDate = function(date) {
          date = me._tryFuzzyDates(date);
          if (moment(date).isValid()) {
            return moment(date).format(me.dFormat);
          } else {
            return null;
          }
        };
        body = $document.find('body').eq(0);
        el = null;
        setPos = function() {
          var height, newLeft, newTop, offset, scrollLeft, scrollTop;
          offset = getOffset(elem[0]);
          height = elem[0].offsetHeight;
          scrollTop = body[0].scrollTop || document.documentElement.scrollTop;
          scrollLeft = body[0].scrollLeft || document.documentElement.scrollLeft;
          newTop = (offset.top + height) - scrollTop;
          if (newTop + swiperBox[0].offsetHeight > $window.innerHeight) {
            newTop = $window.innerHeight - swiperBox[0].offsetHeight;
          }
          if (newTop < 0) {
            newTop = 0;
          }
          newLeft = offset.left - scrollLeft;
          if (newLeft + swiperBox[0].offsetWidth > $window.innerWidth) {
            newLeft = $window.innerWidth - swiperBox[0].offsetWidth;
          }
          if (newLeft < 0) {
            newLeft = 0;
          }
          swiperBox[0].style.position = 'absolute';
          swiperBox[0].style.top = newTop + 'px';
          return swiperBox[0].style.left = newLeft + 'px';
        };
        keyDown = function(ev) {
          var date, newDate, offset;
          offset = 0;
          switch (ev.keyCode) {
            case 39:
              offset = 1;
              break;
            case 37:
              offset = -1;
              break;
            case 38:
              offset = -7;
              break;
            case 40:
              offset = 7;
              break;
            case 13:
            case 32:
            case 27:
              ev.preventDefault();
              return scope.done();
          }
          date = new Date(scope.date);
          newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
          $timeout(function() {
            return scope.setDate(newDate);
          });
          return ev.preventDefault();
        };
        scope.open = function() {
          var com;
          if (datePicker.isOpen()) {
            return;
          }
          datePicker.setOpen(true);
          el = angular.element($templateCache.get('directives/date-picker/date-picker.html'));
          com = $compile(el)(scope);
          body.append(com);
          el.addClass(customClasses);
          swiper = el;
          carousel = angular.element(el[0].querySelector('.carousel'));
          swiperBox = angular.element(el[0].querySelector('.date-picker-box'));
          $('.done', el[0]).focus();
          hammerSwiper = new Hammer(swiper[0]);
          d = void 0;
          x = 0;
          y = 0;
          init(scope.ngModel);
          if (scope.anchor) {
            setPos();
            el.addClass('open');
            $window.addEventListener('scroll', setPos);
            $window.addEventListener('resize', setPos);
          }
          return $window.addEventListener('keydown', keyDown);
        };
        scope.$on('$destroy', function() {
          return scope.done(0);
        });
        return scope.done = function(time) {
          ctrl.$setDirty();
          if (el) {
            d = new Date(scope.date);
            d.setHours(9);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            scope.ngModel = d.valueOf();
            setValidity();
            el.addClass('closing');
            $timeout(function() {
              datePicker.setOpen(false);
              el.remove();
              return hammerSwiper = null;
            }, angular.isDefined(time) ? time : 200);
          }
          if (scope.anchor) {
            $window.removeEventListener('scroll', setPos);
            $window.removeEventListener('resize', setPos);
          }
          $window.removeEventListener('keydown', keyDown);
          return typeof scope.change === "function" ? scope.change() : void 0;
        };
      }
    };
  });

}).call(this);
