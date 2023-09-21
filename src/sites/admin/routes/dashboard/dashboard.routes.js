angular.module('vs-admin').config(function($stateProvider) {
  console.log('setting up admin routes');
  return $stateProvider.state('admin_dashboard', {
    url: '/admin',
    template: '<admin-dashboard></admin-dashboard>',
    data: {
      title: 'Vitalspace Admin - Dashboard',
      auth: ['superadmin', 'admin']
    }
  });
})