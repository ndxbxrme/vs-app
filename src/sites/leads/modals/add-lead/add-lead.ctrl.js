angular.module('vs-leads').controller('addLeadModalCtrl', function($scope, $state, data, ndxModalInstance, env) {
  $scope.selectedProperty = data.selectedProperty || null;
  $scope.disabled = false;
  $scope.submitted = false;
  
  // Initialize lead - either new or editing existing
  if (data.lead) {
    // Editing existing lead
    $scope.lead = data.lead;
  } else {
    // Creating new lead
    $scope.lead = $scope.single('leads:leads', {}, function(lead) {
      lead.item = {
        roleType: data.roleType || 'Selling',
        source: 'local',
        user: {}
      };
    });
  }
  
  $scope.sources = {
    items: [
      { name: 'Email', _id: 'email' },
      { name: 'Telephone', _id: 'telephone' },
      { name: 'Walk In', _id: 'walkin' },
      { name: 'OnTheMarket', _id: 'onthemarket' }
    ]
  };
  
  // Get selling properties
  $scope.selling = $scope.list({
    route: `${env.PROPERTY_URL}/search`
  }, {
    where: {
      RoleType: 'Selling',
      IncludeStc: true
    },
    transform: {
      items: 'Collection',
      total: 'TotalCount'
    }
  }, function(properties) {
    properties.items.forEach(property => {
      property.name = property.displayAddress;
      property._id = property.RoleId;
    });
  });
  
  // Get letting properties
  $scope.letting = $scope.list({
    route: `${env.PROPERTY_URL}/search`
  }, {
    where: {
      RoleType: 'Letting',
      IncludeStc: true
    },
    transform: {
      items: 'Collection',
      total: 'TotalCount'
    }
  }, function(properties) {
    properties.items.forEach(property => {
      property.name = property.displayAddress;
      property._id = property.RoleId;
    });
  });
  
  $scope.save = function() {
    $scope.submitted = true;
    if ($scope.myForm.$valid) {
      // Handle property selection
      if ($scope.selectedProperty && $scope.lead.item.roleType !== 'Valuation') {
        const propertyList = $scope.lead.item.roleType === 'Selling' ? $scope.selling.items : $scope.letting.items;
        const selectedProp = propertyList.find(p => p._id === $scope.selectedProperty);
        if (selectedProp) {
          $scope.lead.item.property = {
            address: selectedProp.AddressNumber + ' ' + selectedProp.Address1,
            postcode: selectedProp.Postcode
          };
          $scope.lead.item.price = selectedProp.Price;
        }
      }
      
      $scope.lead.item.date = new Date();
      $scope.lead.item.applicant = `${$scope.lead.item.user.title} ${$scope.lead.item.user.first_name} ${$scope.lead.item.user.last_name}`;
      
      $scope.lead.save('lead').then(() => {
        ndxModalInstance.close();
        $state.reload();
      });
    }
  };
  
  $scope.cancel = function() {
    ndxModalInstance.dismiss();
  };
});
