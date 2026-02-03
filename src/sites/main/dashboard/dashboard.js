angular.module('vs-app')
.controller('mainDashboardCtrl', function($scope, Auth, $filter, $timeout, ndxCheck, env, $http, $stateParams) {
  $scope.thing = 'hiya';
  $scope.unknownSolicitors = [];
  $scope.env = env;
  
  if (ndxCheck && ndxCheck.setPristine) {
    ndxCheck.setPristine($scope);
  }
  
  $scope.$on('$destroy', function() {
    if (ndxCheck && ndxCheck.setPristine) {
      ndxCheck.setPristine($scope);
    }
  });
  
  const hasAgencyAccess = Auth.isAuthorized('agency_dashboard');
  const hasLettingsAccess = Auth.isAuthorized('lettings_dashboard');
  const hasBothAccess = hasAgencyAccess && hasLettingsAccess;
  
  $scope.hasAgencyAccess = hasAgencyAccess;
  $scope.hasLettingsAccess = hasLettingsAccess;
  $scope.hasBothAccess = hasBothAccess;
  
  // Set initial active view based on URL parameter or permissions
  if ($stateParams.view === 'lettings' && hasLettingsAccess) {
    $scope.activeView = 'lettings';
  } else if ($stateParams.view === 'sales' && hasAgencyAccess) {
    $scope.activeView = 'sales';
  } else if (hasBothAccess) {
    $scope.activeView = 'sales'; // Default to sales if user has both
  } else if (hasAgencyAccess) {
    $scope.activeView = 'sales';
  } else if (hasLettingsAccess) {
    $scope.activeView = 'lettings';
  }
  
  $scope.setActiveView = function(view) {
    $scope.activeView = view;
  };
  
  // Fetch sales leads total (for agency users)
  if (hasAgencyAccess) {
    $scope.salesComingSoon = $scope.list('agency:marketing', {
      where: {
        completed: null
      },
      page: 1,
      pageSize: 10
    });
    
    $scope.salesLeads = $scope.list('leads:leads', {
      where: {
        roleType: 'Selling',
        booked: null
      },
      page: 1,
      pageSize: 0
    });
    
    $scope.valuationLeads = $scope.list('leads:leads', {
      where: {
        roleType: 'Valuation',
        booked: null
      },
      page: 1,
      pageSize: 0
    });
    
    $scope.offers = $scope.list('leads:offers', {
      where: {
        actioned: null
      },
      sort: 'date',
      sortDir: 'DESC',
      page: 1,
      pageSize: 10
    });
  }

  if (hasLettingsAccess) {
    $scope.lettingLeads = $scope.list('leads:leads', {
      where: {
        roleType: 'Letting',
        booked: null
      },
      page: 1,
      pageSize: 0
    });
    
    $scope.lettingValuationLeads = $scope.list('leads:leads', {
      where: {
        roleType: 'Valuation',
        booked: null
      },
      page: 1,
      pageSize: 0
    });
    
    $scope.availableProperties = $scope.list({
      route: `${$scope.env.PROPERTY_URL}/search`
    }, {
      where: {
        RoleStatus: 'InstructionToLet',
        RoleType: 'Letting',
        IncludeStc: true
      },
      transform: {
        items: 'Collection',
        total: 'TotalCount'
      }
    });
    
    $scope.agreedLets = $scope.list('lettings:properties', {
      where: {
        Status: 'OfferAccepted',
        delisted: false
      },
      page: 1,
      pageSize: 0
    });
    
    $scope.comingSoon = $scope.list('lettings:marketing', {
      where: {
        completed: null
      },
      page: 1,
      pageSize: 10
    });
    
    $scope.lettingOffers = $scope.list('leads:offerslettings', {
      where: {
        actioned: null
      },
      sort: 'date',
      sortDir: 'DESC',
      page: 1,
      pageSize: 10
    });
    
    $scope.nextMoveInFiltered = [];
    $scope.nextMoveIn = $scope.list('lettings:properties', {
      where: {
        Status: 'OfferAccepted',
        delisted: false
      },
      sort: 'proposedMoving',
      sortDir: 'ASC',
      page: 1,
      pageSize: 50
    }, function(properties) {
      const now = new Date();
      const twentyFourHoursFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
      
      $scope.nextMoveInFiltered = [];
      if (properties && properties.items) {
        properties.items.forEach(property => {
          if (property.proposedMoving) {
            const moveInDate = new Date(property.proposedMoving);
            if (moveInDate <= twentyFourHoursFromNow) {
              $scope.nextMoveInFiltered.push(property);
            }
          }
        });
      }
    });
  }
  
  const currentUser = Auth.getUser();
  $scope.myPipeline = 0;
  $scope.myLettingsPipeline = 0;
  
  if (currentUser) {
    $scope.consultants = $scope.list('main:users', null, (users) => {
      const currentUserEmail = currentUser.local.email;
      const consultant = users.items.find(user => user.local.email === currentUserEmail);
      
      if (!consultant) {
        return;
      }
      
      const userId = consultant._id;
      
      if (hasAgencyAccess) {
        $scope.properties = $scope.list('agency:properties', {
          where: { 
            modifiedAt: { $gt: new Date('2022-12-20').valueOf() }
          },
          transformer: 'dashboard/properties'
        }, function(properties) {
          let count = 0;
          $scope.unknownSolicitors = [];
          if (properties && properties.items) {
            for (let i = 0; i < properties.items.length; i++) {
              const property = properties.items[i];
              if (property.override && property.override.deleted === true) {
                continue;
              }
              if (!property.role) {
                continue;
              }
              if (property.role.RoleStatus.SystemName !== 'OfferAccepted') {
                continue;
              }
              if (Object.values(property.milestoneIndex)[0] === 10) {
                continue;
              }
              // Check if property is stale (more than 1 year old)
              const stale = new Date(property.role.CreatedDate) < (new Date() - (365 * 24 * 60 * 60 * 1000));
              if (stale) {
                continue;
              }
              // Check for unknown solicitors
              const missingPurchaser = !property.purchasersSolicitor || !Object.keys(property.purchasersSolicitor).length;
              const missingVendor = !property.vendorsSolicitor || !Object.keys(property.vendorsSolicitor).length;
              if (missingPurchaser || missingVendor) {
                const solRecord = {
                  _id: property._id,
                  roleId: property.role.SalesRoleId,
                  address: property.displayAddress,
                  p: missingPurchaser,
                  v: missingVendor
                };
                $scope.unknownSolicitors.push(solRecord);
              }
              // Match by consultant ID
              if (property.consultant === userId) {
                count++;
              }
            }
          }
          $scope.myPipeline = count;
        });
      }
      
      if (!hasAgencyAccess && hasLettingsAccess) {
        $scope.lettingsProperties = $scope.list('lettings:properties', {
          where: {
            Status: 'OfferAccepted',
            delisted: false
          }
        }, function(properties) {
          let count = 0;
          if (properties && properties.items) {
            for (let i = 0; i < properties.items.length; i++) {
              const property = properties.items[i];
              if (property.override && property.override.deleted === true) {
                continue;
              }
              // Check if property is stale (more than 1 year old)
              if (property.role && property.role.CreatedDate) {
                const stale = new Date(property.role.CreatedDate) < (new Date() - (365 * 24 * 60 * 60 * 1000));
                if (stale) {
                  continue;
                }
              }
              // Match by consultant ID
              if (property.consultant === userId) {
                count++;
              }
            }
          }
          $scope.myLettingsPipeline = count;
        });
      }
    });
  }
  
  $scope.formatAddress = (address) => {
    if(!address) return '';
    return address.replace(/, ,/g, ',');
  }
  
  $scope.getGreeting = function() {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };
  
  $scope.getFirstName = function() {
    if (currentUser && currentUser.local && currentUser.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    return 'There';
  };
  
  $scope.getFormattedDate = function() {
    const date = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Add ordinal suffix
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';
    
    return `${dayName}, ${day}${suffix} ${month} ${year}`;
  };

  // Sales chart data - current year only
  $scope.chartData = [];
  $scope.lettingsChartData = [];
  
  function initializeChart() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const months = [];
    
    // Generate all 12 months of current year
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      months.push({
        date: date,
        month: $filter('date')(date, 'MMM'),
        startDate: date.valueOf(),
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0).valueOf(),
        actual: 0,
        target: 0
      });
    }
    
    if (hasAgencyAccess) {
      $scope.chartData = months;
      
      // Fetch targets
      $scope.targets = $scope.list('agency:targets', {
      where: {
        type: 'salesAgreed'
      }
    }, function(targets) {
      if (targets && targets.items) {
        targets.items.forEach(target => {
          const targetMonth = $scope.chartData.find(m => 
            new Date(target.date).getMonth() === new Date(m.startDate).getMonth() &&
            new Date(target.date).getFullYear() === new Date(m.startDate).getFullYear()
          );
          if (targetMonth) {
            targetMonth.target = target.value || 0;
          }
        });
      }
      renderChart('sales-graph', $scope.chartData, 'Reality Sales', 'Target Sales');
    });
    
    const yearStart = new Date(currentYear, 0, 1).valueOf();
    $scope.salesProperties = $scope.list('agency:properties', {
      where: {
        startDate: {
          $gt: yearStart
        }
      }
    }, function(properties) {
      $scope.chartData.forEach(m => m.actual = 0);
      
      if (properties && properties.items) {
        properties.items.forEach(property => {
          if (property.override && property.override.deleted) return;
          if (!property.startDate) return;
          
          const propertyDate = new Date(property.startDate);
          const month = $scope.chartData.find(m => 
            propertyDate >= new Date(m.startDate) && propertyDate <= new Date(m.endDate)
          );
          
          if (month) {
            month.actual++;
          }
        });
      }
      renderChart('sales-graph', $scope.chartData, 'Reality Sales', 'Target Sales');
    });
    }
    
    if (hasLettingsAccess) {
      $scope.lettingsChartData = JSON.parse(JSON.stringify(months));
      
      $scope.lettingsTargets = $scope.list('lettings:targets', {
        where: {
          type: 'letsAgreed'
        }
      }, function(targets) {
        if (targets && targets.items) {
          targets.items.forEach(target => {
            const targetMonth = $scope.lettingsChartData.find(m => 
              new Date(target.date).getMonth() === new Date(m.startDate).getMonth() &&
              new Date(target.date).getFullYear() === new Date(m.startDate).getFullYear()
            );
            if (targetMonth) {
              targetMonth.target = target.value || 0;
            }
          });
        }
        renderChart('lettings-graph', $scope.lettingsChartData, 'Reality Lets', 'Target Lets');
      });
      
      const yearStart = new Date(currentYear, 0, 1).valueOf();
      const yearEnd = new Date(currentYear + 1, 0, 1).valueOf();
      
      $http.post($http.sites["lettings"].url + "/api/agreed/search", {
        startDate: yearStart,
        endDate: yearEnd
      }, $http.sites["lettings"].config).then(function(res) {
        $scope.lettingsChartData.forEach(m => m.actual = 0);
        
        let yearToDateTotal = 0;
        
        if (res.data && res.data.length) {
          res.data.forEach(month => {
            const monthDate = new Date(month.date);
            const chartMonth = $scope.lettingsChartData.find(m => {
              const chartDate = new Date(m.startDate);
              return chartDate.getFullYear() === monthDate.getFullYear() && 
                     chartDate.getMonth() === monthDate.getMonth();
            });
            
            if (chartMonth && month.properties) {
              chartMonth.actual = month.properties.length;
              yearToDateTotal += month.properties.length;
            }
          });
        }
        
        renderChart('lettings-graph', $scope.lettingsChartData, 'Reality Lets', 'Target Lets');
      });
    }
  }
  
  function renderChart(containerId, chartData, actualLabel, targetLabel) {
    if (!chartData.length) return;
    
    $timeout(function() {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      container.innerHTML = '';
      
      const maxValue = Math.max(
        ...(chartData.map(d => Math.max(d.actual, d.target))),
        1
      );
      
      // Create chart
      const chartHTML = `
        <div class="chart-bars">
          ${chartData.map(month => {
            const targetHeight = (month.target / maxValue) * 100;
            const actualHeight = (month.actual / maxValue) * 100;
            return `
            <div class="bar-group">
              <div class="bars">
                <div class="bar bar-actual" style="height: ${actualHeight}%">
                  <span class="bar-value ${actualHeight < 30 ? 'bar-value-small' : ''}">${month.actual}</span>
                </div>
                <div class="bar bar-target" style="height: ${targetHeight}%">
                  <span class="bar-value ${targetHeight < 30 ? 'bar-value-small' : ''}">${month.target}</span>
                </div>
              </div>
              <div class="bar-label">${month.month}</div>
            </div>
          `;
          }).join('')}
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color legend-actual"></span>
            <span class="legend-label">${actualLabel}</span>
            <span class="legend-value">${chartData.reduce((sum, m) => sum + m.actual, 0)}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color legend-target"></span>
            <span class="legend-label">${targetLabel}</span>
            <span class="legend-value">${chartData.reduce((sum, m) => sum + (+m.target || 0), 0)}</span>
          </div>
        </div>
      `;
      
      container.innerHTML = chartHTML;
      
      // Trigger animation
      $timeout(() => {
        const bars = container.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
          bar.style.animationDelay = `${index * 0.1}s`;
          bar.classList.add('animate');
        });
      }, 50);
    });
  }
  
  initializeChart();
})
.config(($stateProvider) => $stateProvider.state('dashboard', {
  url: '/?view',
  params: {
    view: {
      value: null,
      squash: true
    }
  },
  template: require('./dashboard.html').default,
  controller: 'mainDashboardCtrl',
  data: {title:'Vitalspace App - Dashboard'}
}));