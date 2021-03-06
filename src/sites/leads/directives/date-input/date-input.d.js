// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('ndx').directive('leadsDateInput', function($filter, $timeout) {
    return {
      require: 'ngModel',
      scope: {
        ngModel: '='
      },
      link: function(scope, elem, attrs, ctrl) {
        var blur, date;
        date = null;
        ctrl.$parsers.push(function(val) {
          date = interpretDate.interpretText(val);
          if (date) {
            date.setHours(9);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            date.valueOf();
            ctrl.$setValidity('date', true);
          } else {
            if (val) {
              ctrl.$setValidity('date', false);
            }
          }
          return val;
        });
        ctrl.$formatters.push(function(val) {
          if (Object.prototype.toString.call(val) === '[object Number]') {
            date = new Date(val);
          }
          if (val && date) {
            if (attrs.min) {
              ctrl.$setValidity('min', date.valueOf() >= +attrs.min);
            }
            if (attrs.max) {
              ctrl.$setValidity('max', date.valueOf() <= +attrs.max);
            }
            ctrl.$setValidity('date', true);
          } else {
            ctrl.$setValidity('min', true);
            ctrl.$setValidity('max', true);
            ctrl.$setValidity('date', true);
          }
          return $filter('date')(val, scope.$root.mediumDate);
        });
        blur = function() {
          return $timeout(function() {
            if (date) {
              date.setHours(9);
              date.setMinutes(0);
              date.setSeconds(0);
              date.setMilliseconds(0);
              scope.ngModel = date.valueOf();
            } else {
              scope.ngModel = null;
            }
            return ctrl.$render();
          });
        };
        elem[0].addEventListener('blur', blur);
        return scope.$on('$destroy', function() {
          return elem[0].removeEventListener('blur', blur);
        });
      }
    };
  });

}).call(this);
