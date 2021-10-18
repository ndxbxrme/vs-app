// Generated by CoffeeScript 2.5.1
(function() {
  'use strict';
  angular.module('ndx').factory('DbItem', function($http, $filter, $rootScope, $timeout) {
    var cache, get, getEntity, getObject, index;
    cache = {};
    index = [
      {
        table: 'user',
        keys: {
          insertedBy: true,
          modifiedBy: true,
          impersonatedBy: true,
          authorisationUser: true,
          approvalUser: true,
          user: true,
          userId: true,
          for: true
        },
        toString: function() {
          if (this.local) {
            return this.local.email;
          } else {
            return '';
          }
        },
        toLink: function() {
          return "/users/" + this._id;
        }
      },
      {
        table: 'company',
        keys: {
          company: true
        },
        toString: function() {
          return this.name;
        },
        toLink: function() {
          return "/company/" + this._id;
        }
      },
      {
        table: 'agency',
        keys: {
          agency: true
        },
        toString: function() {
          return this.name;
        },
        toLink: function() {
          return "/agency/" + this._id;
        }
      },
      {
        table: 'contractors',
        keys: {
          contractors: true
        },
        toString: function() {
          return this.name;
        },
        toLink: function() {
          return "/contractors/" + this._id;
        }
      },
      {
        table: 'worker',
        keys: {
          worker: true
        },
        toString: function() {
          return this.firstName + " " + this.lastName;
        },
        toLink: function() {
          return "/worker/" + this._id;
        }
      }
    ];
    get = function(key, data, asObject, cb) {
      var i, item, j, len, len1, mydata, output, table, type;
      if (key && data) {
        type = Object.prototype.toString.call(data);
        if (type === '[object Object]') {
          mydata = JSON.parse(JSON.stringify(data));
          for (key in mydata) {
            mydata[key] = get(key, mydata[key]);
          }
          if (asObject) {
            if (typeof cb === "function") {
              cb();
            }
            return mydata;
          }
          if (typeof cb === "function") {
            cb();
          }
          return JSON.stringify(mydata, null, '  ');
        } else if (type === '[object Array]') {
          output = '';
          for (i = 0, len = data.length; i < len; i++) {
            item = data[i];
            output += get('array', item);
          }
          if (typeof cb === "function") {
            cb();
          }
          return output;
        } else if (/^\d{13}$/.test(data.toString())) {
          if (data.toString() === '9999999999999') {
            return '';
          }
          return $filter('date')(data, $rootScope.mediumDate);
        } else if (/^[\da-z]{24}$/.test(data.toString())) {
          if (cache[data]) {
            if (typeof cb === "function") {
              cb(cache[data]);
            }
            return cache[data];
          }
          cache[data] = data;
          for (j = 0, len1 = index.length; j < len1; j++) {
            table = index[j];
            if (table.keys[key]) {
              $http.get($http.sites["maintenance_leads"].url + "/api/" + table.table + "/" + data, $http.sites["maintenance_leads"].config).then(function(res) {
                cache[data] = res.data;
                cache[data].toString = table.toString;
                cache[data].toLink = table.toLink;
                return typeof cb === "function" ? cb(cache[data]) : void 0;
              }, function(err) {
                return false;
              });
              break;
            }
          }
          return '';
        } else {
          if (typeof cb === "function") {
            cb();
          }
          return data;
        }
      }
    };
    getEntity = function(table, item) {
      var id, ref;
      if (item && (id = item[table] || ((ref = item.assignmentDetails) != null ? ref[table] : void 0))) {
        if (cache[id]) {
          return cache[id];
        }
        cache[id] = {};
        $http.get($http.sites["maintenance_leads"].url + "/api/" + table + "/" + id + "/all", $http.sites["maintenance_leads"].config).then(function(res) {
          return cache[id] = res.data;
        }, function(err) {
          return false;
        });
      }
      return {};
    };
    getObject = function(table, id, obj, fieldsToClone, cb) {
      var fillObject;
      fillObject = function(val) {
        var field, results;
        if (fieldsToClone) {
          if (typeof fieldsToClone === 'string') {
            return obj[fieldsToClone] = val;
          } else {
            results = [];
            for (field in fieldsToClone) {
              results.push(obj[field] = val[fieldsToClone[field]]);
            }
            return results;
          }
        }
      };
      if (cache[id] && JSON.stringify(cache[id]) !== '{}') {
        fillObject(cache[id]);
        return typeof cb === "function" ? cb() : void 0;
      }
      cache[id] = {};
      return $http.get($http.sites["maintenance_leads"].url + "/api/" + table + "/" + id + "/all", $http.sites["maintenance_leads"].config).then(function(res) {
        cache[id] = res.data;
        fillObject(res.data);
        return typeof cb === "function" ? cb() : void 0;
      }, function(err) {
        return false;
      });
    };
    return {
      get: get,
      getEntity: getEntity,
      getObject: getObject,
      getText: function(key, data) {},
      clearCache: function() {
        return cache = {};
      }
    };
  });

}).call(this);
