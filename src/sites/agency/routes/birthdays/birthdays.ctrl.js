angular.module('vs-agency').controller('agencyBirthdaysCtrl', function($scope) {
  
  $scope.birthdays = $scope.list('agency:birthdays', {
  }, (items) => {
    items.items.forEach(item => {item.search = `${item.address.toLowerCase()}|${item.name.toLowerCase()}|${item.email.toLowerCase()}`});
  })
  $scope.page = 1;
  $scope.limit = 30;
  $scope.pageChange = function() {
    return $('html, body').animate({
      scrollTop: 0
    }, 200);
  };
  $scope.birthday = {
    full_date: new Date()
  }
  $scope.controlsHidden = true;
  $scope.showBirthdayControls = () => {
    $scope.controlsHidden = !$scope.controlsHidden;
  }
  $scope.submitBirthday = () => {
    $scope.birthday.date = $scope.birthday.full_date.getDate();
    $scope.birthday.month = $scope.birthday.full_date.getMonth();
    $scope.birthday.year = $scope.birthday.full_date.getFullYear();
    $scope.birthdays.save($scope.birthday);
    $scope.birthday = {
      full_date: new Date()
    }
    $scope.controlsHidden = true;
  }
  $scope.deleteBirthday = (birthday) => {
    if(confirm('Are you sure?')) {
      $scope.birthdays.delete(birthday);
    }
  }
  $scope.age = (birthday) => {
    const then = new Date(birthday);
    const now = new Date();
    const age = Math.floor((now - then) / 1000 / 60 / 60/ 24 / 365);
    return age + ' Year' + (age > 1 ? 's':'');
  }
})