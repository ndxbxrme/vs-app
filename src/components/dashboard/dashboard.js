import './dashboard.css';
angular.module('vs-app')
.controller('mainDashboardCtrl', function($scope) {
  $scope.thing = 'hiya';
})
.config(($stateProvider) => $stateProvider.state('dashboard', {
  url: '/',
  template: require('./dashboard.html').default,
  controller: 'mainDashboardCtrl',
  data: {title:'Vitalspace'}
}));