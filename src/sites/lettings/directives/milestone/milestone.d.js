// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-lettings-inner').directive('lettingsMilestone', function($rootScope, LettingsProgressionPopup) {
    return {
      restrict: 'AE',
      template: require("./milestone.html").default,
      replace: true,
      scope: {
        milestone: '=data',
        disabled: '@'
      },
      link: function(scope, elem, attrs) {
        scope.getClass = function() {
          return {
            completed: scope.milestone.completed,
            progressing: scope.milestone.progressing,
            overdue: scope.milestone.completed ? false : scope.milestone.progressing && new Date().valueOf() > (scope.milestone.userCompletedTime || scope.milestone.estCompletedTime)
          };
        };
        return scope.itemClick = function() {
          var myscope, property;
          if (scope.disabled !== 'true') {
            myscope = scope;
            while (myscope && !(property = myscope.property)) {
              myscope = myscope.$parent;
            }
            return LettingsProgressionPopup.show(elem[0], scope.milestone, property);
          }
        };
      }
    };
  });

  //$rootScope.$emit 'swiper:show'

}).call(this);
