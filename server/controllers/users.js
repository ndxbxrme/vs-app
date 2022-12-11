module.exports = (ndx) => {
  ndx.app.post('/api/send-new-user-email', ndx.authenticate(), async (req, res, next) => {
    console.log('send email', req.body.code);
    if(ndx.email) {
      const template = await ndx.database.selectOne('emailtemplates', {name:'New User'});
      if(template) {
        template.email = req.body.email.trim();
        template.to = template.email;
        const host = 'https://app.vitalspace.co.uk' || process.env.HOST || ndx.settings.HOST || `${req.protocol}://${req.hostname}`;
        template.code = `${host}/invited/${req.body.code}`;
        ndx.email.send(template);
        return res.end(template.code);
      }
    }
    res.end('error: no emails setup');
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
      await ndx.database.upsert('users', user);
      return res.json({error:false});
    }
    res.json({error:'no user'});
  })
}