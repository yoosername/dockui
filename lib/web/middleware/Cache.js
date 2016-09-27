const CacheService = require("../CacheService");

module.exports = function() {
  return function(req,res,next){

    var url = req.url;
    var cached = CacheService.get(url);
    var DEVMODE = process.env.DEV_MODE;

    if(DEVMODE){
      console.log("running with DEV_MODE env var set so skipping all caches");
      return next();
    }

    if(cached && cached.template){
      res.send(cached.template);
    }else{
      next();
    }

  }
}
