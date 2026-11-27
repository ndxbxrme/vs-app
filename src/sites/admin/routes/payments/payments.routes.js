angular.module('vs-admin').config(function($stateProvider) {
  return $stateProvider.state('admin_payments', {
    url: '/admin/payments',
    template: '<admin-payments></admin-payments>',
    data: {
      title: 'Vitalspace Admin - Payments',
      auth: ['superadmin', 'admin', 'agency']
    }
  });
});
