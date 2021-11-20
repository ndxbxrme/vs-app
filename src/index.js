import './third_party/bootstrap-css/css/bootstrap.min.css';
import './index.styl';
const angular = window.angular;
const io = require('socket.io-client');
const RestClient = require('./services/ndx-rest-client.js');
const bootstrap = require('bootstrap');
window.CodeMirror = require('codemirror');
import 'codemirror/lib/codemirror.css';
window.jade = require('jade');
require('./services/ndx-auth.js');
require('./imports.js');
const sites = {
  "main": {
    "name": "main",
    "module": "ndx",
    "url1": "http://localhost:23232",
    "ws1": "ws://localhost:23232",
    "url": "http://92.237.208.72:3001",
    "ws": "ws://92.237.208.72:3001"
  },
  "lettings": {
    "name": "lettings",
    "module": "vs-lettings",
    "url": "https://lettings.vitalspace.co.uk",
    "ws": "ws://lettings.vitalspace.co.uk"
  },
  "maintenance": {
    "name": "maintenance",
    "module": "vs-maintenance",
    "url": "https://maintenance.vitalspace.co.uk",
    "ws": "ws://maintenance.vitalspace.co.uk"
  },
  "maintenance_leads": {
    "name": "maintenance_leads",
    "module": "vs-maintenance-leads",
    "url": "https://maintenance-leads.vitalspace.co.uk",
    "ws": "ws://maintenance-leads.vitalspace.co.uk"
  },
  "agency": {
    "name": "agency",
    "module": "vs-agency",
    "url": "https://conveyancing.vitalspace.co.uk",
    "ws": "ws://conveyancing.vitalspace.co.uk"
  },
  "leads": {
    "name": "leads",
    "module": "vs-leads",
    "url": "https://leads.vitalspace.co.uk",
    "ws": "ws://leads.vitalspace.co.uk"
  }
};
const mainmodule = angular.module('vs-app', Object.values(sites).map(site => site.module));
mainmodule.factory('socket', () => {
  return Object.values(sites).reduce((res, site) => {
    if(site.ws) res.push({name:site.name, io:io(site.ws, {transports:['websocket']})});
    return res;
  }, []);
});
RestClient(mainmodule);
angular.module('vs-lettings').constant('env', {
  PROPERTY_URL: `https://myproperty.vitalspace.co.uk/api`,
  PROPERTY_TOKEN: `U2FsdGVkX1+gN0j3nIuDrf4S1KtTl0vRhxunxFOeDtCZL4szHbINhQMSl3TY+PNFXXcO98NFsIhbVx8rAYArkMQRaW+Yy2jh58LtGwFfwQdp`
})
.run(($rootScope, $http) => {
  $http.sites = sites;
  $http.propertyToken = `U2FsdGVkX1+gN0j3nIuDrf4S1KtTl0vRhxunxFOeDtCZL4szHbINhQMSl3TY+PNFXXcO98NFsIhbVx8rAYArkMQRaW+Yy2jh58LtGwFfwQdp`;
});
require('./imports_local.js');