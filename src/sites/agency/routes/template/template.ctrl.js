// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('vs-agency').controller('agencyTemplateCtrl', function($scope, $stateParams, $state, $http, env) {
    var cb, fetchDefaultProp;
    $scope.type = $stateParams.type;
    cb = function(template) {
      if (template) {
        return $scope.template.locked = true;
      }
    };
    if ($stateParams.type === 'email') {
      $scope.lang = 'jade';
      $scope.template = $scope.single('agency:emailtemplates', $stateParams.id, cb);
    } else {
      $scope.lang = 'text';
      $scope.template = $scope.single('agency:smstemplates', $stateParams.id, cb);
    }
    $scope.save = function() {
      if ($scope.myForm.$valid) {
        $scope.template.save();
        return $state.go('agency_setup');
      }
    };
    $scope.cancel = function() {
      return $state.go('agency_setup');
    };
    $scope.defaultData = {
      displayAddress: "Apt 19 St Lawrence Street, Hulme, Manchester, M15 4DY",
      text: marked("## Advance Progression Request  \n#### Milestone  \n`Searches Completed`  \n#### Advance to  \n`Wed May 24 2017`  \n#### Requested by  \n`Dawn Wetherill`  \n#### Reason  \nA reason  \n"),
      link: "https://conveyancing.vitalspace.co.uk/case/4653108",
      code: "https://conveyancing.vitalspace.co.uk/login/4653108",
      newSales: {
        address: "Apt 19 St Lawrence Street, Hulme, Manchester, M15 4DY",
        bedrooms: "3",
        propertyType: "Apartment",
        access: "Access Instructions",
        newSalesPropertyPrice: "200 000",
        newSalesPropertyUrl: "https://conveyancing.vitalspace.co.uk/case/4653108"
      },
      newLettings: {
        address: "Apt 19 St Lawrence Street, Hulme, Manchester, M15 4DY",
        bedrooms: "3",
        propertyType: "Apartment",
        access: "Access Instructions",
        newLettingsPropertyPrice: "200 000",
        newLettingsPropertyUrl: "https://conveyancing.vitalspace.co.uk/case/4653108",
        propertyStatus: "Furnished",
        propertyNotes: "It's a great house"
      },
      reduction: {
        address: "Apt 19 St Lawrence Street, Hulme, Manchester, M15 4DY",
        reductionPropertyPrice: "1000000"
      },
      unknowns: [
        {
          address: '18 Balmain Road, Urmston, Manchester, M41 5TF',
          id: '4426117',
          purchasingSolicitor: true,
          vendingSolicitor: false
        },
        {
          address: '345d Stretford Road, Hulme, Manchester, M15 4AY',
          id: '8364494',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: ' Crampton Lane, Carrington , Manchester, M31 4WY',
          id: '11861854',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: '17 Carisbrook Avenue, Urmston, Manchester, M41 9DF',
          id: '15949225',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: '8 Moss Lane, Partington, Manchester, M31 4EB',
          id: '16456203',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: '37 Tintern Avenue, Flixton, Manchester, M41 6FH',
          id: '16456122',
          purchasingSolicitor: false,
          vendingSolicitor: true
        },
        {
          address: '35 Sutherland Road, Firswood, Manchester, M16 0HY',
          id: '16693966',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: '11 Falcon Avenue, Urmston, Manchester, M41 9AR',
          id: '16973039',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: '11 Elizabeth Road, Partington, Manchester, M31 4PU',
          id: '16087713',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: '1 Broom Road, Partington, Manchester, M31 4FJ',
          id: '17004161',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: '26 Rothiemay Road, Flixton, Manchester, M41 6LP',
          id: '17055271',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: '3 Minster Drive, Urmston, Manchester, M41 5HA',
          id: '15875450',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: 'Apt 206 Castle Quay, Castlefield, Manchester, M15 4NT',
          id: '17114680',
          purchasingSolicitor: true,
          vendingSolicitor: true
        },
        {
          address: '39 Russell Road, Partington, Manchester, M31 4DY',
          id: '17072807',
          purchasingSolicitor: true,
          vendingSolicitor: true
        }
      ],
      birthday: {
        name: 'Richard Antrobus',
        address: '123 Station Road, Stretford, M32 9RF',
      }
    };
    fetchDefaultProp = function() {
      return $http.post(`${env.PROPERTY_URL}/search`, {
        RoleStatus: 'OfferAccepted',
        RoleType: 'Selling',
        IncludeStc: true,
        PageSize: 1
      }, $http.sites["agency"].config).then(function(response) {
        if (response.data && response.data.Collection && response.data.Collection.length) {
          $scope.defaultData.property = response.data.Collection[0];
          return $http.get($http.sites["agency"].url + `/api/properties/${$scope.defaultData.property.RoleId}`, $http.sites["agency"].config).then(function(response) {
            if (response.data) {
              $scope.defaultData.property.case = response.data;
              return $scope.defaultData.contact = response.data.vendorsContact;
            }
          });
        }
      });
    };
    return fetchDefaultProp();
  });

}).call(this);
