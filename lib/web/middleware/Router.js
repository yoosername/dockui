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

    console.log("[Router middleware] : checking matching routes for ", req.url);
    var orig = req.url;
    var routeModules = PluginService.getModulesByType("route");
    var done = false;
    var requiredScopes = null;
    var foundRoute = false;

    routeModules.forEach(function(routeModule){
      if(!done){

        var routes = routeModule.getRoutes();

        console.log("[Router middleware] : found routes provided by Route Module ("+routeModule.getKey()+"): ", routes);
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
                foundRoute = req.url;
                console.log("[Router middleware] : Route matched, changing to: ", req.url);

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

    if( foundRoute ){
      console.log("[Router middleware] : Found and applied route : %s", foundRoute);
    }else{
      console.log("[Router middleware] : Route checking finished and no routes rewrites found, trying direct");
    }

    // If scopes required then  check that first otherwise on to next middleware
    if( requiredScopes != null ){

      console.log("[Router middleware] : Route requires scopes: ", requiredScopes);

      AuthService.testUserHasScopes(req, requiredScopes)
         .then(function(){
            console.log("[Router middleware] : User has the required Auth Scopes: %s", requiredScopes);
            next();
         })
         .catch(function(error){

           if( error instanceof Errors.UserNotAuthenticatedError ){

             console.log("[Router middleware] : User is not authenticated, attempting to authenticate");
             AuthService.authenticate(req)
               .then(function(val){
                 // if we get here then users JWT with scopes is now on the req object so proceed
                 console.log("[Router middleware] : User has been successfully authenticated");
                 next();
               })
               .catch(function(authError){

                 // If couldnt authenticate the user then send 401
                 if( authError instanceof Errors.UserAuthenticationFailedError ){
                   console.log("[Router middleware] : Authentication failed");
                   res.status(401).send(authError);
                 }
                 // If redirect requested then send redirect
                 else if( authError instanceof Errors.AuthenticationRedirectRequestedError ){
                   console.log("[Router middleware] : Authentication failed and redirect was requested");
                   res.redirect(authError.url + "?next=" + req.url);
                 }
                 // Anything else send 500
                 else{
                   console.log("[Router middleware] : Authentication failed for unkown reason : ", authError);
                   res.status(500).send(authError);
                 }
               })

           }
           else if( error instanceof Errors.UserMissingRequiredScopesError ){
             console.log("[Router middleware] : User is authenticated but does not have required scopes");
             res.status(401).send(error);
           }else{
             console.log("[Router middleware] : User is authenticated but unknown error occured");
             res.status(500).send(error);
           }

         })

    }else{
      console.log("[Router middleware] : No auth scopes are required");
      next();
    }

  }
}
