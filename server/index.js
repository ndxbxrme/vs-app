const crypto = require('crypto-js');
const path = require('path');
const express = require('express');
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_KEY,
  region: process.env.AWS_REGION, // Specify your S3 bucket's region
});
require('ndx-server').config({
  database: 'db',
  tables: ['users', 'emailtemplates', 'smstemplates', 'numberlists', 'schedule', 'boards', 'propertyadmin'],
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
  const updateUserTokens = (user) => {
    const makeToken = (userId, key, hours) => {
      let text = userId + '||' + new Date(new Date().setHours(new Date().getHours() + hours)).toString();
      return crypto.Rabbit.encrypt(text, key).toString();
    }
    if(user && user.local && user.local.sites) {
      Object.values(user.local.sites).forEach(site => {
        site.token = makeToken(site.id, "thisismysecretdontforgetit", 1);
      });
    }
  };
  ndx.addPublicRoute('/api/refresh-login');
  ndx.addPublicRoute('/api/user-code');
  ndx.addPublicRoute('/api/complete-registration');
  ndx.addPublicRoute('/api/forgot-password');
  ndx.addPublicRoute('/api/logout');
  ndx.database.on('select', (args, cb) => {
    console.log('database select', args.table, args.objs.length);
    if(args.table==='users' && args.objs.length===1) {
      const user = args.objs[0];
      updateUserTokens(user);
      return cb(true);
    }
    else {
      cb(true);
    }
  });
  ndx.app.post('/api/upload-pdf', (req, res) => {
    const { base64, filename } = req.body;
    if (!base64 || !filename) {
      return res.status(400).send('Invalid PDF data.');
    }
    const pdfBuffer = Buffer.from(base64, 'base64');
    const s3 = new AWS.S3();
    const params = {
      Bucket: 'vitalspace-worksorders',
      Key: filename,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading to S3', err);
        res.status(500).send('Error uploading to S3');
      } else {
        console.log('Uploaded to S3', data.Location);
        res.status(200).send('PDF uploaded to S3');
      }
    });
  });
  ndx.app.post('/webhook/:roleId', async (req, res) => {
    const roleId = +req.params.roleId;
    let property = await ndx.database.selectOne('propertyadmin', {RoleId:roleId});
    if(!property) {
      await ndx.database.insert('propertyadmin', {RoleId:roleId,source:'webhook'});
    }
    res.end('ok');
  })
})
.start();