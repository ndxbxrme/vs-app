module.exports = (ndx) => {
  ndx.postAuthenticate = function(req, res, next) {
    res.send(JSON.stringify({id:req.user._id,token:ndx.generateToken(req.user._id, null, 1, true)}));
  };
}