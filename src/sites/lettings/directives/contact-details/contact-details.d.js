// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-lettings-inner').directive('lettingsContactDetails', function(alert) {
    return {
      restrict: 'EA',
      template: require("./contact-details.html").default,
      replace: true,
      scope: {
        title: '@'
      },
      link: function(scope, elem, attrs) {
        var fieldName, propCopy;
        scope.editing = false;
        fieldName = scope.title;
        propCopy = null;
        scope.edit = function() {
          propCopy = JSON.parse(JSON.stringify(scope.data()));
          return scope.editing = true;
        };
        scope.data = function() {
          var property;
          property = scope.$parent.property;
          if (property && property.item && property.item.$case && property.item.$case.item) {
            if (!property.item.$case.item[fieldName]) {
              property.item.$case.item[fieldName] = {};
            }
            return property.item.$case.item[fieldName];
          }
        };
        scope.confirm = function() {
          //save to database
          scope.$parent.property.item.$case.save();
          alert.log('Contact details updated');
          return scope.editing = false;
        };
        return scope.cancel = function() {
          var property;
          if (propCopy) {
            property = scope.data();
            Object.assign(property, propCopy);
            propCopy = null;
          }
          return scope.editing = false;
        };
      }
    };
  });

}).call(this);
