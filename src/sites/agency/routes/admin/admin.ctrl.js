(function() {
  'use strict';
  angular.module('vs-agency').directive('agencyAdminTooltip', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        let tooltip;
        const initialise = $timeout(function() {
          if (!window.bootstrap || !window.bootstrap.Tooltip) {
            console.error('Bootstrap Tooltip is unavailable');
            return;
          }
          tooltip = new window.bootstrap.Tooltip(element[0], {
            container: 'body',
            delay: {
              show: 75,
              hide: 50
            },
            placement: 'top',
            trigger: 'hover focus'
          });
        }, 0, false);

        scope.$on('$destroy', function() {
          $timeout.cancel(initialise);
          if (tooltip) tooltip.dispose();
        });
      }
    };
  });

  angular.module('vs-agency').controller('agencyAdminCtrl', function($scope, $filter, env) {
    const groups = [
      {
        key: 'available',
        label: 'Available',
        icon: 'fa-sign-hanging',
        columns: [
          { key: 'available-board', label: 'Board', title: 'Board ordered', path: 'instructionToMarket.boardOrderedDate', requiresDate: true },
          { key: 'available-window', label: 'Window', title: 'Window card', path: 'instructionToMarket.windowsCard' },
          { key: 'available-epc', label: 'EPC', title: 'EPC ordered', path: 'instructionToMarket.epcOrderedDate' },
          { key: 'available-misdescriptions', label: 'Misd.', title: 'Misdescriptions received', path: 'instructionToMarket.misdescriptionsReceived' }
        ]
      },
      {
        key: 'sstc',
        label: 'SSTC',
        icon: 'fa-handshake',
        columns: [
          { key: 'sstc-memo', label: 'Memo', title: 'Memo of sale issued', path: 'soldSubjectToContract.memoOfSale' },
          { key: 'sstc-chain', label: 'Chain', title: 'Chain updated on conveyancing', path: 'soldSubjectToContract.chainUpdated' },
          { key: 'sstc-board', label: 'Board', title: 'Board updated', path: 'soldSubjectToContract.boardUpdated', unavailableRequiresAction: true },
          { key: 'sstc-board-type', label: 'Board Type', title: 'Board type', path: 'soldSubjectToContract.boardType' },
          { key: 'sstc-exchanged', label: 'Exch.', title: 'Date of exchange', path: 'exchangedCompleted.dateExchange' }
        ]
      },
      {
        key: 'reduced',
        label: 'Reduced',
        icon: 'fa-arrow-trend-down',
        columns: [
          { key: 'reduced-window', label: 'Window', title: 'New window card', path: 'priceReduction.newWindowCard' },
          { key: 'reduced-matched', label: 'Matched', title: 'Re-matched', path: 'priceReduction.reMatched' }
        ]
      },
      {
        key: 'fall-through',
        label: 'Fall Through',
        icon: 'fa-octagon-xmark',
        columns: [
          { key: 'fall-through-board', label: 'Board', title: 'Board updated after fall through', path: 'fallenThrough.boardUpdated' },
          { key: 'fall-through-window', label: 'Window', title: 'Property back in window', path: 'fallenThrough.backInWindow' }
        ]
      }
    ];

    $scope.adminGroups = groups;
    $scope.adminColumns = groups.reduce((columns, group) => {
      return columns.concat(group.columns.map((column, index) => {
        return Object.assign({}, column, {
          groupKey: group.key,
          groupStart: index === 0,
          groupEnd: index === group.columns.length - 1
        });
      }));
    }, []);
    $scope.adminTables = [
      { key: 'available', title: 'Available Sales Properties', type: 'available', rows: [], page: 1, pageSize: '20', sort: '-instructed' },
      { key: 'sstc', title: 'SSTC', type: 'sstc', rows: [], page: 1, pageSize: '20', sort: '-instructed' }
    ];
    $scope.adminSummary = [
      { key: 'boards', label: 'Boards Erected', value: 0, icon: 'fa-sign-hanging', tone: 'success' },
      { key: 'epc', label: 'EPC Outstanding', value: 0, icon: 'fa-file-certificate', tone: 'alert' },
      { key: 'misdescriptions', label: 'Misdescriptions Outstanding', value: 0, icon: 'fa-file-circle-exclamation', tone: 'alert' }
    ];
    $scope.activeAdminTable = 'available';

    const getItems = (collection) => {
      return collection && collection.items ? collection.items : [];
    };

    const getValue = (item, path) => {
      return path.split('.').reduce((value, key) => {
        return value && value[key] !== undefined ? value[key] : undefined;
      }, item);
    };

    const hasValidDate = (value) => {
      if (value === undefined || value === null || value === '') return false;
      return value instanceof Date ? !Number.isNaN(value.valueOf()) : !Number.isNaN(new Date(value).valueOf());
    };

    const getStatus = (value, column) => {
      if (column.requiresDate && !hasValidDate(value)) return 'required';
      if (value === undefined || value === null || value === '') return 'pending';
      const normalizedValue = typeof value === 'string' ? value.toLowerCase() : value;
      if (column.unavailableRequiresAction && (normalizedValue === 'no board' || normalizedValue === 'not applicable' || normalizedValue === 'n/a')) return 'required';
      if (normalizedValue === 'no board' || normalizedValue === 'not applicable' || normalizedValue === 'n/a') return 'unavailable';
      if (normalizedValue === 'no') return 'required';
      return 'completed';
    };

    const getAddress = (property) => {
      if (property.displayAddress) return property.displayAddress;
      const address = property.Address || {};
      const street = [address.Number, address.Street].filter(Boolean).join(' ');
      return [street, address.Locality, address.Town, address.Postcode].filter(Boolean).join(', ');
    };

    const getShortAddress = (property, fullAddress) => {
      const address = property.Address || {};
      return [address.Number, address.Street].filter(Boolean).join(' ') || fullAddress.split(',')[0];
    };

    const getFee = (property) => {
      const fee = property.Fees && property.Fees[0];
      if (!fee || fee.DefaultValue === undefined || fee.DefaultValue === null) return '-';
      const feeType = fee.FeeValueType && (fee.FeeValueType.SystemName || fee.FeeValueType.DisplayName);
      if (feeType === 'Percentage') return `${+fee.DefaultValue}%`;
      const decimals = Number.isInteger(+fee.DefaultValue) ? 0 : 2;
      return $filter('currency')(+fee.DefaultValue, '£', decimals);
    };

    const getValuer = (propertyAdmin, usersById) => {
      const valuerId = getValue(propertyAdmin, 'instructionToMarket.instructedBy');
      return valuerId ? usersById[String(valuerId)] : null;
    };

    const buildRow = (property, type, propertyAdminByRoleId, usersById) => {
      const roleId = String(property.RoleId || property.roleId || '');
      const propertyAdmin = propertyAdminByRoleId[roleId] || {};
      const cells = $scope.adminColumns.map((column) => {
        const value = getValue(propertyAdmin, column.path);
        const status = getStatus(value, column);
        const statusLabel = {
          completed: 'Completed',
          pending: 'Not started',
          unavailable: 'Unavailable',
          required: column.requiresDate ? 'Date required' : 'Action required'
        }[status];
        return Object.assign({}, column, {
          status: status,
          description: `${column.title}: ${statusLabel}${value ? ` (${value})` : ''}`
        });
      });
      const completed = cells.filter((cell) => cell.status === 'completed').length;
      const valuer = getValuer(propertyAdmin, usersById);
      const fullAddress = getAddress(property);
      const address = getShortAddress(property, fullAddress);

      return {
        type: type,
        property: property,
        roleId: roleId,
        address: address || 'Address unavailable',
        fee: getFee(property),
        instructed: property.DateInstructed,
        cells: cells,
        completed: completed,
        percent: Math.round((completed / cells.length) * 100),
        valuer: valuer,
        search: `${fullAddress || ''} ${valuer && valuer.displayName || ''}`.toLowerCase()
      };
    };

    const rebuildRows = () => {
      const propertyAdminByRoleId = getItems($scope.propertyAdmins).reduce((items, item) => {
        if (item.RoleId !== undefined && item.RoleId !== null) items[String(item.RoleId)] = item;
        return items;
      }, {});
      const usersById = getItems($scope.users).reduce((items, user) => {
        if (user._id) items[String(user._id)] = user;
        return items;
      }, {});

      $scope.adminTables[0].rows = getItems($scope.availableProperties).map((property) => {
        return buildRow(property, 'available', propertyAdminByRoleId, usersById);
      });
      $scope.adminTables[1].rows = getItems($scope.sstcProperties).map((property) => {
        return buildRow(property, 'sstc', propertyAdminByRoleId, usersById);
      });

      const allRows = $scope.adminTables.reduce((rows, table) => rows.concat(table.rows), []);
      const countCells = (cellKey, status) => {
        return allRows.reduce((total, row) => {
          return total + (row.cells.some((cell) => cell.key === cellKey && cell.status === status) ? 1 : 0);
        }, 0);
      };
      $scope.adminSummary[0].value = countCells('available-board', 'completed');
      $scope.adminSummary[1].value = countCells('available-epc', 'required');
      $scope.adminSummary[2].value = countCells('available-misdescriptions', 'required');
    };

    $scope.matchesAdminSearch = (row) => {
      return !$scope.adminSearch || row.search.indexOf($scope.adminSearch.toLowerCase()) !== -1;
    };
    $scope.resetAdminPages = () => {
      $scope.adminTables.forEach((table) => {
        table.page = 1;
      });
    };
    $scope.changeAdminPageSize = (table) => {
      table.page = 1;
    };
    $scope.changeAdminSort = (table, field) => {
      if (table.sort === `-${field}`) {
        table.sort = field;
      } else {
        table.sort = `-${field}`;
      }
      table.page = 1;
    };
    $scope.isAdminSortActive = (table, field) => {
      return table.sort === field || table.sort === `-${field}`;
    };
    $scope.getAdminSortDirection = (table, field) => {
      if (! $scope.isAdminSortActive(table, field)) return '';
      return table.sort.charAt(0) === '-' ? 'descending' : 'ascending';
    };
    $scope.getAdminPageLimit = (table) => {
      return table.pageSize === 'all' ? table.filteredRows.length : +table.pageSize;
    };
    $scope.getAdminPageOffset = (table) => {
      return table.pageSize === 'all' ? 0 : +table.pageSize * (table.page - 1);
    };
    $scope.showAdminTable = (tableKey) => {
      $scope.activeAdminTable = tableKey;
    };
    $scope.isAdminLoading = () => {
      return !$scope.availableProperties || !$scope.availableProperties.items ||
        !$scope.sstcProperties || !$scope.sstcProperties.items ||
        !$scope.propertyAdmins || !$scope.propertyAdmins.items ||
        !$scope.users || !$scope.users.items;
    };
    $scope.hasAdminError = () => {
      return Boolean(
        $scope.availableProperties && $scope.availableProperties.error ||
        $scope.sstcProperties && $scope.sstcProperties.error ||
        $scope.propertyAdmins && $scope.propertyAdmins.error ||
        $scope.users && $scope.users.error
      );
    };

    $scope.propertyAdmins = $scope.list('main:propertyadmin', null, rebuildRows);
    $scope.users = $scope.list('main:users', null, rebuildRows);
    $scope.availableProperties = $scope.list('agency:clientmanagement', {
      where: {
        active: true
      }
    }, rebuildRows);
    $scope.sstcProperties = $scope.list({
      route: `${env.PROPERTY_URL}/search`
    }, {
      where: {
        RoleStatus: 'OfferAccepted',
        RoleType: 'Selling',
        IncludeStc: true
      },
      transform: {
        items: 'Collection',
        total: 'TotalCount'
      }
    }, rebuildRows);
  });
}).call(this);
