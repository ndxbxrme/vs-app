angular.module('vs-app')
.directive('footer', function() {
  return {
    scope: {},
    replace: true,
    template: require('./footer.html').default,
    link: (scope) => {
      scope.version = '1.1.0';
    },
    currentyear: number = new Date().getFullYear()
  }
})