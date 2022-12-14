// Generated by CoffeeScript 2.6.0
(function() {
  'use strict';
  angular.module('vs-agency').filter('hasDocument', function() {
    return function(property, docName) {
      var document, i, len, ref;
      if (!property) {
        return;
      }
      if (property.Documents && property.Documents.length) {
        ref = property.Documents;
        for (i = 0, len = ref.length; i < len; i++) {
          document = ref[i];
          if (document.DocumentSubType.DisplayName === docName) {
            return 'Yes';
          }
        }
      }
      return 'No';
    };
  });

}).call(this);