// Generated by CoffeeScript 2.5.1
(function () {
  'use strict';
  angular.module('vs-maintenance-leads').directive('messageCenter', function ($timeout, $filter, $rootScope, $stateParams, $http, TaskPopup) {
    return {
      restrict: 'EA',
      template: require("./message-center.html").default,
      link: function (scope, elem, attrs) {
        scope.messageSort = '-date';
        scope.messageFilter = '';
        scope.setMessageFilter = function (entity) {
          if (entity === scope.messageFilter) {
            return scope.messageFilter = "";
          }
          return scope.messageFilter = entity;
        };
        if (scope.issue.item.newMessages) {
          scope.issue.item.newMessages = 0;
          scope.issue.save();
        }
        //scope.issue.item.messages = scope.issue.item.messages.sort (a, b) -> if a.replyId > b.replyId then 1 else -1
        scope.single('maintenance_leads:landlords', {
          _id: scope.issue.item.landlordId || 'noone'
        }, function (landlord) {
          scope.issue.item.landlordName = landlord.item.name;
          scope.issue.item.landlordPhone = landlord.item.phone;
          scope.issue.item.landlordEmail = landlord.item.email;
          scope.messageRecipients = [
            {
              name: 'Tenant: ' + scope.issue.item.tenant + ' - ' + scope.issue.item.tenantEmail,
              _id: 'Tenant::' + scope.issue.item.tenant + '::' + scope.issue.item.tenantEmail
            }
          ];
          if (landlord && landlord.item && Object.keys(landlord.item).length) {
            scope.messageRecipients.push({
              name: 'Landlord: ' + landlord.item.name + ' - ' + landlord.item.email,
              _id: 'Landlord::' + landlord.item.name + '::' + landlord.item.email
            });
          }
          if (scope.tasks.items[0]) {
            return scope.single('maintenance_leads:contractors', {
              _id: scope.tasks.items[0].contractor
            }, function (contractor) {
              scope.issue.item.contractorName = contractor.item.name;
              scope.issue.item.contractorPhone = contractor.item.phone;
              scope.issue.item.contractorEmail = contractor.item.email;
              return scope.messageRecipients.push({
                name: 'Contractor: ' + contractor.item.name + ' - ' + contractor.item.email,
                _id: 'Contractor::' + contractor.item.name + '::' + contractor.item.email
              });
            });
          }
        });
        scope.emailTemplates = scope.list('maintenance_leads:emailtemplates');
        scope.sendEmail = function () {
          var ref;
          if (scope.outgoingEmail && scope.outgoingEmail.item.messageTo) {
            scope.outgoingEmail.issueId = scope.issue.item._id;
            scope.outgoingEmail.attachments = (ref = scope.issue.item.documents) != null ? ref.filter(function (document) {
              return document.$attached;
            }) : void 0;
            return $http.post($http.sites["maintenance_leads"].url + '/api/message-center/send', scope.outgoingEmail, $http.sites["maintenance_leads"].config).then(function (response) {
              var ref1;
              scope.outgoingEmail = {};
              scope.composingMessage = false;
              return (ref1 = scope.issue.item.documents) != null ? ref1.map(function (document) {
                return delete document.$attached;
              }) : void 0;
            });
          }
        };
        scope.reply = function (message) {
          scope.composingMessage = true;
          scope.outgoingEmail = {
            item: {
              subject: 'Re: ' + message.subject.replace(/^Re: /, ''),
              messageTo: message.from + '::' + message.fromName + '::' + message.sender
            },
            body: '',
            prevBody: message.body,
            replyId: message.replyId
          };
          return document.querySelector('.page').scrollIntoView();
        };
        scope.templateize = () => {
          const $t = (s, data) => (s).replace(/\{\{(.+?)\}\}/g, (all, m) => {
            try {
              return (new Function(`with(this) {` + (m.includes('return') ? m : `return (${m})`) + '}').call(data))
            } catch(e) {
              return '';
            }
          });
          $timeout(() => {
            try {
              scope.outgoingEmail.item.subject = $t(scope.outgoingEmail.item.subject, scope.issue.item);
              scope.outgoingEmail.body = $t(scope.outgoingEmail.body, scope.issue.item);
            } catch(e) {}
          });
        }
        scope.selectTemplate = async () => {
          const selectedTemplate = scope.emailTemplates.items.find(item => item._id === scope.template);
          if (selectedTemplate) {
            console.log(selectedTemplate);
            scope.outgoingEmail = scope.outgoingEmail || { item: {} };
            scope.outgoingEmail.item = scope.outgoingEmail.item || {};
            scope.outgoingEmail.item.subject = selectedTemplate.subject;
            scope.outgoingEmail.body = selectedTemplate.body;
            scope.templateize();
          }
        };

        return scope.noAttachments = function () {
          var ref;
          return (ref = scope.issue.item.documents) != null ? ref.filter(function (doc) {
            return doc.$attached;
          }).length : void 0;
        };
      }
    };
  });

}).call(this);
