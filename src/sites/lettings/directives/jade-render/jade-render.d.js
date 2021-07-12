// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-lettings-inner').directive('jadeRender', function($timeout) {
    return {
      restrict: 'AE',
      replace: true,
      require: 'ngModel',
      template: '<iframe></iframe>',
      scope: {
        data: '=',
        ngModel: '='
      },
      link: function(scope, elem, attrs, ngModel) {
        var doc, render;
        doc = elem[0].contentWindow.document;
        render = function() {
          console.log('rendering');
          var e;
          try {
            return doc.body.innerHTML = jade.render(scope.ngModel, scope.data);
          } catch (error) {
            e = error;
            console.log('error', error);
            return false;
          }
        };
        ngModel.$formatters.unshift(function(val) {
          render();
          return val;
        });
        return scope.$watch('data', function(n, o) {
          if (n) {
            return $timeout(render, 500);
          }
        });
      }
    };
  });

}).call(this);
