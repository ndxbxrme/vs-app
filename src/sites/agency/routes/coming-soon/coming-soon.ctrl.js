import './coming-soon.styl'
angular.module('vs-agency')
.directive('agencyComingSoon', function(alert, env) {
  return {
    template: require('./coming-soon.html').default,
    scope: {},
    link: (scope) => {
      scope.page = 1;
      scope.limit = 15;
      scope.pageChange = function() {
        return $('html, body').animate({
          scrollTop: 0
        }, 200);
      };
      const assignUsers = () => {
        if(!scope.instructions || !scope.instructions.items || !scope.users || !scope.users.items) return;
        scope.instructions.items.forEach(instruction => {
          if(typeof(instruction.user==='string')) {
            const user = scope.users.items.find((user) => user.displayName === instruction.user);
            if(user) {
              instruction.user = {
                displayName: user.displayName,
                email: user.local.email
              };
            }
          }
        })
      }
      scope.users = scope.list('main:users', null, (users) => {
        assignUsers();
      });
      scope.instructions = scope.list('leads:instructions', null, (instructions) => {
        instructions.items.forEach(item => {
          if(item.insertedOn) item.insertedOn = new Date(item.insertedOn);
          if(item.goLiveDate) item.goLiveDate = new Date(item.goLiveDate);
          if(item.dateOfPhotos) item.dateOfPhotos = new Date(item.dateOfPhotos);
        })
        assignUsers();
      });
      scope.save = (item) => {
        scope.instructions.save(item);
        alert.log('Data saved');
      }
      scope.completeInstruction = (item) => {
        scope.instructions.delete(item);
        alert.log('New instruction completed');
      };
      scope.item = {
        'uid': 123,
        'address': '7 Montrose Ave, Stretford Manchester M32 9LN',
        'vendorName': 'Ms Ann Woodrow',
        'user': {
          'displayName': 'Sally Bennet',
          'email': 'sally@vitalspace.co.uk'
        },
        'instructedOn': '',
        'askingPrice': '300000',
        'fee': '2500'
        
      }
    }
  }
});