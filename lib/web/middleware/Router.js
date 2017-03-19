var PluginService = require('../../plugin/PluginService');
var toRegexp = require('path-to-regexp');
var AuthService = require("../AuthService");
var Errors = require("../Errors")

function toMap(params) {
  var map = {};

  params.forEach(function(param, i) {
    param.index = i;
    map[param.name] = param;
  });

  return map;
}

module.exports = function() {
  return function(req, res, next) {

    var orig = req.url;
    var routeModules = PluginService.getModulesByType("route");
    var done = false;
    var requiredScopes = null;

    console.log("checking modules for routes: ", req.url);
    routeModules.forEach(function(routeModule){
      if(!done){

        var routes = routeModule.getRoutes();

        console.log("routes for module("+routeModule.getKey()+"): ", routes);
        routes.forEach(function(route){
          if(!done){

            var routeString = route;

            var matchKeys = [];
            var routeRegex = toRegexp(routeString, matchKeys);
            var map = toMap(matchKeys);
            var path = routeModule.getPath();
            if( routeRegex && path ){

              var match = routeRegex.exec(orig);
              if( match ){

                // If here then the route matches. We build the path and rewrite it and move to next item
                req.url = (path || routeString).replace(/\$(\d+)|(?::(\w+))/g, function(_, n, name) {
                  if (name) {
                    if (match) return match[map[name].index + 1];
                    else return req.params[name];
                  } else if (match) {
                    return match[n];
                  } else {
                    return req.params[n];
                  }
                });
                console.log("route changed to: ", req.url);

                // Does route require aut scopes?
                if( routeModule.requiredScopes() != null ){
                  requiredScopes = routeModule.requiredScopes();
                }

                // End here and pass to next middleware
                done = true;

              }
            }
          }

        })
      }

    });
    console.log("all routes checked - ending route checker");

    // If scopes required then  check that first otherwise on to next middleware
    if( requiredScopes != null ){

      console.log("Route requires scopes: ", requiredScopes);

      AuthService.testUserHasScopes(req, requiredScopes)
         .then(function(){
            console.log("User has the required Auth Scopes: %s", requiredScopes);
            next();
         })
         .catch(function(error){

           console.log(error);
           if( error instanceof Errors.UserNotAuthenticatedError ){

             AuthService.authenticate(req)
               .then(function(val){
                 // if we get here then users JWT with scopes is now on the req object so proceed
                 console.log("User has been successfully authenticated");
                 next();
               })
               .catch(function(authError){

                 // If couldnt authenticate the user then send 401
                 if( authError instanceof Errors.UserAuthenticationFailedError ){
                   res.status(401).send(authError);
                 }
                 // If redirect requested then send redirect
                 else if( authError instanceof Errors.AuthenticationRedirectRequestedError ){
                   res.redirect(authError.url + "?next=" + req.url);
                 }
                 // Anything else send 500
                 else{
                   res.status(500).send(authError);
                 }
               })

           }
           else if( error instanceof Errors.UserMissingRequiredScopesError ){
             res.status(401).send(error);
           }else{
             res.status(500).send(error);
           }

         })

    }else{
      console.log("No auth scopes required");
      next();
    }

  }
}
