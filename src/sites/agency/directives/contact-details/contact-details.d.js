// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-agency').directive('contactDetails', function(alert) {
    return {
      restrict: 'EA',
      template: require("./contact-details.html").default,
      replace: true,
      scope: {
        title: '@'
      },
      link: function(scope, elem, attrs) {
        var fieldName;
        scope.editing = false;
        fieldName = _.str.camelize(_.str.slugify(scope.title));
        scope.edit = function() {
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
        return scope.confirm = function() {
          //save to database
          scope.$parent.property.item.$case.save();
          alert.log('Contact details updated');
          return scope.editing = false;
        };
      }
    };
  });

}).call(this);
