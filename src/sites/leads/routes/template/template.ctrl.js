// Generated by CoffeeScript 2.5.1
(function () {
  'use strict';
  angular.module('vs-leads').controller('leadsTemplateCtrl', function ($scope, $stateParams, $state, $http, env) {
    var cb;
    $scope.type = $stateParams.type;
    $scope.defaultLast = 'setup';
    cb = function (template) {
      if (template) {
        return $scope.template.locked = true;
      }
    };
    if ($stateParams.type === 'email') {
      $scope.lang = 'pug';
      $scope.template = $scope.single('leads:emailtemplates', $stateParams.id, cb);
    } else {
      $scope.lang = 'text';
      $scope.template = $scope.single('leads:smstemplates', $stateParams.id, cb);
    }
    $scope.emailActions = {
      items: [
        {
          _id: 'leadAdded',
          name: 'Lead added'
        },
        {
          _id: 'leadBooked',
          name: 'Lead booked'
        },
        {
          _id: 'leadDeleted',
          name: 'Lead deleted'
        },
        {
          _id: 'valuationAdded',
          name: 'Valuation added'
        },
        {
          _id: 'valuationBooked',
          name: 'Valuation booked'
        },
        {
          _id: 'valuationDeleted',
          name: 'Valuation deleted'
        }
      ]
    };
    $scope.sendTo = {
      items: [
        {
          _id: 'applicant',
          name: 'Applicant'
        },
        {
          _id: 'admin',
          name: 'Admin'
        },
        {
          _id: 'agency',
          name: 'Agency'
        }
      ]
    };
    return $scope.defaultData = {
      offer: {
        "date": "2024-02-13T18:47:05.000Z",
        "uid": "gv31:20034",
        "email": "richard@vitalspace.co.uk",
        "telephone": "07977473111",
        "applicant": "Mr. Test Tester",
        "applicant2": "Mrs. Test Tester",
        "applicantAddress": "31 testing new system, testing, test, M41 5AA",
        "propertyId": "73049",
        "offerAmount": "127420",
        "movingPosition": "Buying to let",
        "financialPosition": "Cash Buyer",
        "hasConveyancer": "No",
        "comments": "I'd like to buy this house",
        "roleId": "27157921",
        "address": "31 Balfour Road, Urmston",
        "image": "https://vitalspace.co.uk/wp-content/uploads/2024/02/40307729-590x400.jpg",
        "price": "325,000",
        "uploads": [
          {
            "key": "48",
            "file": "https://vitalspace.co.uk/wp-content/uploads/gravity_forms/31-094c2a38a409adf8063f6945547a02d9/2024/02/IMG_1596.PNG"
          },
          {
            "key": "55",
            "file": "https://vitalspace.co.uk/wp-content/uploads/gravity_forms/31-094c2a38a409adf8063f6945547a02d9/2024/02/IMG_1597.PNG"
          },
          {
            "key": "58",
            "file": "https://vitalspace.co.uk/wp-content/uploads/gravity_forms/31-094c2a38a409adf8063f6945547a02d9/2024/02/27-Gorse-Works4.pdf"
          }
        ],
        "insertedAt": 1707850052747,
        "modifiedAt": 1707850052747,
        "insertedBy": "655e5b0f63ff610065123275",
        "modifiedBy": "655e5b0f63ff610065123275",
        "_id": "65cbb94494782e0065476202",
        "search": "31 balfour road, urmston:mr. test test:",
        "$$hashKey": "object:356"
      },
      lead: {
        'date': 1516950731000,
        'uid': 'rm165564926',
        'email': 'bgfountain@gmail.com',
        'user': {
          'title': 'Mr',
          'address': '5 Cartwright Road',
          'postcode': 'M21 9EY',
          'country': 'GB',
          'first_name': 'Ben',
          'last_name': 'Fountain',
          'phone_day': '07796266255',
          'phone_evening': null,
          'dpa_flag': false
        },
        'comments': 'Hello,\u000d\nI\'d like to view the property. Is there any chance of a viewing either over this weekend, or next Wednesday?',
        'roleId': 8546607,
        'propertyId': 947606,
        'rightmoveId': 70011173,
        'property': {
          'address': '26 Newcroft Road',
          'address2': 'Urmston',
          'town': 'Manchester',
          'county': '',
          'postcode': 'M41 9NN'
        },
        'roleType': 'Selling',
        'price': 270000,
        'source': 'rightmove',
        'method': 'email',
        'insertedAt': 1517130025895,
        'modifiedAt': 1517130025895,
        'applicant': 'Mr Ben Fountain',
        's': 'mr ben fountain|26 newcroft road|m41 9nn',
        '_id': '5a6d91293771932fbceee4d5'
      },
      user: {
        'local': {
          'email': 'test@test.com',
          'password': '$2a$08$zx6DMb.u4rNBF2BH5oqPgeZdwgyMfhusIxD2CwTvPpBLACELRiJOa'
        },
        'roles': {
          'agency': {}
        },
        'displayName': 'Test User',
        'telephone': '235',
        'insertedAt': 1516825280173,
        'modifiedAt': 1516825280173,
        'insertedBy': '5a68e93dc8ca2a148c5f88ee',
        'modifiedBy': '5a68e93dc8ca2a148c5f88ee',
        '_id': '5a68eac04df69819f8a04157'
      }
    };
  });

}).call(this);
