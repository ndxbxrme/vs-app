module.exports = (ndx) => {
  ndx.app.post('/api/send-new-user-email', ndx.authenticate(), async (req, res, next) => {
    console.log('send email', req.body.code);
    if(ndx.email) {
      const template = await ndx.database.selectOne('emailtemplates', {name:'New User'});
      if(template) {
        template.email = req.body.email.trim();
        template.to = template.email;
        const host = process.env.HOST || ndx.settings.HOST || `${req.protocol}://${req.hostname}`;
        template.code = `${host}/invited/${req.body.code}`;
        ndx.email.send(template);
        return res.end(template.code);
      }
    }
    res.end('error: no emails setup');
  })
}