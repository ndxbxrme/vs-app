angular.module('vs-app')
.directive('menu', function(breadcrumbs) {
  return {
    scope: {},
    replace: true,
    template: require('./menu.html').default,
    link: (scope) => {
      scope.breadcrumbs = breadcrumbs;
    }
  }
})