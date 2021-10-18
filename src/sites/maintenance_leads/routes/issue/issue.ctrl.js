// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-maintenance-leads').controller('maintenance_leadsIssueCtrl', function($scope, $stateParams, $state, $http, Auth, Upload, alert, breadcrumbs) {
    var myParams;
    $scope.fetched = false;
    $scope.submitted = false;
    $scope.sources = [
      {
        name: 'FixFlo',
        _id: 'fixflo'
      },
      {
        name: 'Telephone',
        _id: 'telephone'
      },
      {
        name: 'Walk in',
        _id: 'walkin'
      },
      {
        name: 'Email',
        _id: 'email'
      }
    ];
    $scope.yesno = [
      {
        name: 'Yes',
        _id: 'yes'
      },
      {
        name: 'No',
        _id: 'no'
      }
    ];
    myParams = {
      _id: $stateParams._id,
      $or: [
        {
          deleted: {
            $ne: null
          }
        },
        {
          deleted: null
        }
      ]
    };
    $scope.messageRecipients = [];
    $scope.issue = $scope.single('maintenance_leads:issues', myParams, function(issue) {
      var i, len, message, ref;
      console.log(issue.item);
      breadcrumbs.setInfo(issue.item.address);
      if ($scope.issue.item.messages) {
        ref = $scope.issue.item.messages;
        for (i = 0, len = ref.length; i < len; i++) {
          message = ref[i];
          message.entity = message.from || message.toEntity;
        }
      }
      if (!issue.item.source) {
        issue.item.source = 'telephone';
      }
      return $scope.fetched = true;
    });
    $scope.contractors = $scope.list('maintenance_leads:contractors');
    $scope.landlords = $scope.list('maintenance_leads:landlords');
    $scope.tasks = $scope.list('maintenance_leads:tasks', {
      where: {
        issue: myParams._id
      },
      sort: 'date',
      sortDir: 'DESC'
    });
    $scope.addNote = function() {
      var i, len, mynote, ref, ref1, ref2;
      if ($scope.note) {
        if ($scope.note.date) {
          ref = $scope.issue.item.notes || [];
          for (i = 0, len = ref.length; i < len; i++) {
            mynote = ref[i];
            if (mynote.date === $scope.note.date && ((ref1 = mynote.user) != null ? ref1._id : void 0) === ((ref2 = $scope.note.user) != null ? ref2._id : void 0)) {
              mynote.text = $scope.note.text;
              mynote.updatedAt = new Date();
              mynote.updatedBy = Auth.getUser();
              alert.log('Note updated');
              break;
            }
          }
        } else {
          $scope.issue.item.notes = $scope.issue.item.notes || [];
          $scope.issue.item.notes.push({
            date: new Date().valueOf(),
            text: $scope.note.text,
            item: 'Note',
            side: '',
            user: Auth.getUser()
          });
          alert.log('Note added');
        }
        $http.post($http.sites["maintenance_leads"].url + '/api/notes/' + $scope.issue.item._id, {
          notes: $scope.issue.item.notes
        //console.log res.data
        }, $http.sites["maintenance_leads"].config).then(function(res) {}, function(err) {
          return console.log('error saving notes');
        });
        return $scope.note = null;
      }
    };
    $scope.editNote = function(note) {
      $scope.note = JSON.parse(JSON.stringify(note));
      return $('.add-note')[0].scrollIntoView(true);
    };
    $scope.deleteNote = function(note) {
      var i, len, mynote, ref, ref1, ref2, results;
      ref = $scope.issue.item.notes || [];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        mynote = ref[i];
        if (mynote.date === note.date && ((ref1 = mynote.user) != null ? ref1._id : void 0) === ((ref2 = note.user) != null ? ref2._id : void 0)) {
          $scope.issue.item.notes.remove(mynote);
          alert.log('Note deleted');
          $scope.issue.save();
          $scope.note = null;
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    $scope.deleteIssue = function(issue) {
      return $scope.modal({
        template: require('../../modals/issue-delete/issue-delete.html').default,
        controller: 'maintenance_leadsIssueDeleteCtrl',
        size: 'small'
      }, $http.sites["maintenance_leads"].config).then(function() {
        $scope.issue.delete();
        $state.go('dashboard');
        return alert.log('Issue deleted');
      }, function(err) {
        return console.log('err', err);
      });
    };
    $scope.showLightbox = function(media) {
      return $scope.modal({
        template: require('../../modals/lightbox/lightbox.html').default,
        controller: 'maintenance_leadsLightboxCtrl',
        size: 'large',
        data: media
      }, $http.sites["maintenance_leads"].config).then(function() {});
    };
    //just be happy
    $scope.chaseContractor = function(method, task) {
      return $http.get($http.sites["maintenance_leads"].url + '/api/chase/' + method + '/' + task._id, $http.sites["maintenance_leads"].config).then(function(res) {
        if (res.data === 'OK') {
          return alert.log('Contractor chased');
        }
      });
    };
    $scope.chaseInvoice = function(method, task) {
      return $http.get($http.sites["maintenance_leads"].url + '/api/chase-invoice/' + method + '/' + task._id, $http.sites["maintenance_leads"].config).then(function(res) {
        if (res.data === 'OK') {
          return alert.log('Invoice chased');
        }
      });
    };
    $scope.informTenant = function(method, task) {
      return $http.get($http.sites["maintenance_leads"].url + '/api/inform/' + method + '/' + task._id, $http.sites["maintenance_leads"].config).then(function(res) {
        if (res.data === 'OK') {
          return alert.log('Tenant informed');
        }
      });
    };
    $scope.completeIssue = function(issue) {
      return $http.get($http.sites["maintenance_leads"].url + '/api/complete/' + issue.item._id, $http.sites["maintenance_leads"].config).then(function(res) {
        if (res.data === 'OK') {
          return alert.log('Issue Completed');
        }
      });
    };
    $scope.uploadFiles = function(files, errFiles) {
      var myissue;
      myissue = $scope.issue;
      if (files) {
        return Upload.upload({
          url: '/maintenance_leads/api/upload',
          data: {
            file: files,
            user: Auth.getUser()
          }
        }, $http.sites["maintenance_leads"].config).then(function(response) {
          var document, i, len, ref;
          if (response.data) {
            $scope.uploadProgress = 0;
            if (!myissue.item.documents) {
              myissue.item.documents = [];
            }
            ref = response.data;
            for (i = 0, len = ref.length; i < len; i++) {
              document = ref[i];
              myissue.item.documents.push(document);
            }
            alert.log('Document uploaded');
            return myissue.save();
          }
        }, function(err) {
          return false;
        }, function(progress) {
          return $scope.uploadProgress = Math.min(100, parseInt(100.0 * progress.loaded / progress.total));
        });
      }
    };
    $scope.saveDocument = function(document) {
      document.editing = false;
      alert.log('Document updated');
      return $scope.issue.save();
    };
    $scope.deleteDocument = function(document) {
      if ($window.confirm('Are you sure you want to delete this document?')) {
        $scope.issue.item.documents.splice($scope.issue.item.documents.indexOf(document), 1);
        alert.log('Document deleted');
        return $scope.issue.save();
      }
    };
    return $scope.saveFn = function(cb) {
      if ($scope.issue.item.date && !$scope.editing) {
        return $scope.modal({
          template: require('../../modals/issue-book/issue-book.html').default,
          controller: 'maintenance_leadsIssueBookCtrl',
          size: 'small'
        }, $http.sites["maintenance_leads"].config).then(function(cfpJobNumber) {
          $scope.issue.item.cfpJobNumber = cfpJobNumber;
          $scope.issue.item.isBooked = true;
          alert.log('Issue Booked');
          return cb(true);
        }, function(err) {
          return cb(false);
        });
      } else {
        $scope.issue.item.date = $scope.issue.item.date || new Date().valueOf();
        return cb(true);
      }
    };
  });

}).call(this);
