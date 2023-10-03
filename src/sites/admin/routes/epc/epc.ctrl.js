import './epc.styl'
angular.module('vs-admin')
.directive('adminEpc', function(alert) {
  return {
    template: require('./epc.html').default,
    scope: {},
    link: (scope) => {
      scope.page = 1;
      scope.limit = 15;
      scope.pageChange = function() {
        return $('html, body').animate({
          scrollTop: 0
        }, 200);
      };
      scope.properties = scope.list('agency:clientmanagement', {
        where: {
          active:true,
          instructionToMarket:{
            epcOrderedDate:'No'
          }
        }
      });
      scope.deleteEPC = (property) => {
        property.instructionToMarket.epcOrderedDate = null;
        scope.properties.save(property);
        alert.log('Property EPC deleted');
      }
      scope.completedEPC = (property) => {
        property.instructionToMarket.epcOrderedDate = new Date().toISOString().split('T')[0];
        scope.properties.save(property);
        alert.log('Property EPC completed');
      }
    }
  }
});