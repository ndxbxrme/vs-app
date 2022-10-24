// Generated by CoffeeScript 2.6.0
(function() {
  'use strict';
  angular.module('vs-agency').controller('agencyClientManagementDetailsCtrl', function($scope, $stateParams, $state, $timeout, $window, Auth, progressionPopup, agencyProperty, Upload, env, alert) {
    $scope.property = $scope.single('agency:clientmanagement', $stateParams.id, function(res) {
      var property;
      property = res.item;
      property.displayAddress = `${property.Address.Number} ${property.Address.Street}, ${property.Address.Locality}, ${property.Address.Town}, ${property.Address.Postcode}`;
      return console.log(property);
    });
    $scope.date = {
      date: 'today'
    };
    $scope.addNote = function() {
      var i, len, mynote, property, ref;
      console.log('add note', $scope);
      if ($scope.note) {
        property = $scope.property.item;
        if (property) {
          if ($scope.note.date) {
            if (property.notes) {
              ref = property.notes;
              for (i = 0, len = ref.length; i < len; i++) {
                mynote = ref[i];
                if (mynote.date === $scope.note.date && mynote.item === $scope.note.item && mynote.side === $scope.note.side) {
                  mynote.text = $scope.note.text;
                  mynote.updatedAt = new Date();
                  mynote.updatedBy = Auth.getUser();
                }
              }
            }
          } else {
            if (!property.notes) {
              property.notes = [];
            }
            property.notes.push({
              date: new Date(),
              text: $scope.note.text,
              item: 'Case Note',
              side: '',
              user: Auth.getUser()
            });
          }
          $scope.property.save();
          alert.log('Note added');
          return $scope.note = null;
        }
      }
    };
    $scope.editNote = function(note) {
      $scope.note = JSON.parse(JSON.stringify(note));
      return $('.add-note')[0].scrollIntoView(true);
    };
    $scope.deleteNote = function(note) {
      var i, len, mynote, property, ref;
      property = $scope.property.item;
      if (property.notes) {
        ref = property.notes;
        for (i = 0, len = ref.length; i < len; i++) {
          mynote = ref[i];
          if (mynote.date === note.date && mynote.item === note.item && mynote.side === note.side) {
            property.notes.remove(mynote);
            break;
          }
        }
      }
      $scope.property.save();
      alert.log('Note deleted');
      return $scope.note = null;
    };
    return $scope.getNotes = function() {
      var ref, ref1;
      return (ref = $scope.property) != null ? (ref1 = ref.item) != null ? ref1.notes : void 0 : void 0;
    };
  });

}).call(this);
