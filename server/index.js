const crypto = require('crypto-js');
const path = require('path');
const express = require('express');
require('ndx-server').config({
  database: 'db',
  tables: ['users', 'emailtemplates', 'smstemplates', 'numberlists', 'schedule'],
  localStorage: './data',
  hasInvite: true,
  hasForgot: true,
  softDelete: true,
  publicUser: {
    _id: true,
    displayName: true,
    local: {
      email: true,
      sites: true
    },
    roles: true
  }
})
.use(function(ndx) {
  ndx.addPublicRoute('/api/refresh-login');
  ndx.addPublicRoute('/api/user-code');
  ndx.addPublicRoute('/api/complete-registration');
  ndx.addPublicRoute('/api/forgot-password');
  ndx.database.on('select', (args, cb) => {
    if(args.table==='users' && args.objs.length===1) {
      const makeToken = (userId, key, hours) => {
        let text = userId + '||' + new Date(new Date().setHours(new Date().getHours() + hours)).toString();
        return crypto.Rabbit.encrypt(text, key).toString();
      }
      const user = args.objs[0];
      if(user && user.local && user.local.sites) {
        Object.values(user.local.sites).forEach(site => {
          site.token = makeToken(site.id, "thisismysecretdontforgetit", 1);
        });
      }
      return cb(true);
    }
    else {
      cb(true);
    }
  });
})
.start();