angular.module('vs-admin').config(function($stateProvider) {
  return $stateProvider.state('sms_templates', {
    url: '/admin/sms-templates',
    template: '<sms-templates></sms-templates>',
    data: {
      title: 'Vitalspace Admin - Letter Templates',
      auth: ['superadmin', 'admin', 'agency']
    }
  });
})