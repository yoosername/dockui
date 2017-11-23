const CacheService = require("../CacheService");

// TODO: THe cacheService is prepopulated by the various other services
// It only has to handle time outs etc.

module.exports = function() {
  return function(req,res,next){

    console.log("[Cache middleware] : DEV_MODE=", process.env.DEV_MODE);

    var url = req.url;
    var cached = CacheService.get(url);
    var DEVMODE = process.env.DEV_MODE;

    if(DEVMODE){
      return next();
    }

    if(cached && cached.template){
      res.send(cached.template);
    }else{
      next();
    }

  }
}
