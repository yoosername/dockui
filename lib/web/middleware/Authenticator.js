var AuthService = require('../AuthService');

module.exports = function() {
  return function(req,res,next){

    // TODO: If authRequired then try to authenticate use AuthService

    console.log("Authentictating");
    console.log("Route ("+req.url+") requires auth? ", (req.authRequired) ? true : false);
    if(req.authRequired){
      AuthService.authenticate(req.url).then(function(context){
        if( context.authenticated ){
          next();
        }else if( context.redirect ){
          console.log("context.redirect: ", context.redirect);
          res.redirect(context.redirect.url + "?then=" + context.redirect.then);
        }else{
          res.status(401).send("No authentication providers found or authentication failed");
        }
      });
    }else{
      next();
    }
  }
}
