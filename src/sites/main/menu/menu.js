angular.module('vs-app')
.directive('menu', function(breadcrumbs, $stateParams, $window) {
  return {
    scope: {},
    replace: true,
    template: require('./menu.html').default,
    link: (scope) => {
      scope.breadcrumbs = breadcrumbs;
      scope.stateParams = $stateParams;
      scope.menuOpen = false;
      scope.openSubmenu = null;
      
      scope.isDashboardView = function(view) {
        if (!scope.state('dashboard')) {
          return false;
        }
        return $stateParams.view === view || (!$stateParams.view && view === 'sales');
      };
      
      scope.toggleMenu = function($event) {
        $event.stopPropagation();
        scope.menuOpen = !scope.menuOpen;
        if (!scope.menuOpen) {
          scope.openSubmenu = null;
        }
        // Prevent body scroll when menu is open on mobile
        if (scope.menuOpen && $window.innerWidth < 992) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      };
      
      scope.closeMenu = function() {
        scope.menuOpen = false;
        scope.openSubmenu = null;
        document.body.style.overflow = '';
      };
      
      scope.toggleSubmenu = function(submenu, $event) {
        // On mobile (< 992px), toggle submenu instead of navigating
        if ($window.innerWidth < 992) {
          $event.preventDefault();
          $event.stopPropagation();
          if (scope.openSubmenu === submenu) {
            scope.openSubmenu = null;
          } else {
            scope.openSubmenu = submenu;
          }
        } else {
          // On desktop, close menu and navigate
          scope.closeMenu();
        }
      };
      
      // Clean up on window resize
      angular.element($window).on('resize', function() {
        if ($window.innerWidth >= 992 && scope.menuOpen) {
          scope.closeMenu();
          scope.$apply();
        }
      });
      
      // Clean up on destroy
      scope.$on('$destroy', function() {
        document.body.style.overflow = '';
        angular.element($window).off('resize');
      });
    }
  }
})