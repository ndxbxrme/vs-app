angular.module('vs-admin').config(function($stateProvider) {
  return $stateProvider.state('letter_templates', {
    url: '/admin/letter-templates',
    template: '<letter-templates></letter-templates>',
    data: {
      title: 'Vitalspace Admin - Letter Templates',
      auth: ['superadmin', 'admin', 'agency']
    }
  });
})