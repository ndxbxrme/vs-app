module.exports = (ndx) => {
  const sendInviteEmail = async (templateName, email, code, user) => {
    if(ndx.email) {
      const template = await ndx.database.selectOne('emailtemplates', {name:templateName});
      if(template) {
        template.email = email;
        template.to = template.email;
        const host = 'https://app.vitalspace.co.uk' || process.env.HOST || ndx.settings.HOST;
        template.code = `${host}/invited/${code}`;
        ndx.email.send(template);
        return true;
      }
    }
    return false;
  }
  ndx.app.post('/api/send-new-user-email', ndx.authenticate(), async (req, res, next) => {
    console.log('send email', req.body.code);
    await sendInviteEmail('New User', req.body.email.trim(), req.body.code);
    res.end('error: no emails setup');
  });
  ndx.app.post('/api/forgot-password', async (req, res, next) => {
    const email = req.body.email;
    if(email) {
      const user = await ndx.database.selectOne('users', {local:{email:email},deleted:null});
      if(user) {
        user.code = [...[...new Date().getTime().toString(23)].reverse().join('').substr(0,6)].join('').toUpperCase();
        user.local.password = '';
        console.log('upserting', user);
        await ndx.database.upsert('users', user);
        await sendInviteEmail('Reset Password', email, user.code);
        return res.json({error:null});
      }
    }
    res.json({error:'bad email'});
  });
  ndx.app.post('/api/user-code', async (req, res, next) => {
    const code = req.body.code;
    if(code) {
      const user = await ndx.database.selectOne('users', {code});
      if(user) {
        return res.json({user});
      }
    }
    res.json({error:'bad code'});
  });
  ndx.app.post('/api/complete-registration', async (req, res, next) => {
    const user = req.body.user;
    if(user) {
      user.local.password = ndx.generateHash(req.body.password);
      await ndx.database.upsert('users', user);
      return res.json({error:false});
    }
    res.json({error:'no user'});
  })
}