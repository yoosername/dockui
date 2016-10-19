var PluginService = require('../../plugin/PluginService');
var toRegexp = require('path-to-regexp');

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

                // First check if this route needs auth
                if( routeModule.requiresAuth() ){
                  console.log("route module requires auth - setting flag");
                  req.authRequired = true;
                }

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

                // End here and pass to next middleware
                done = true;

              }
            }
          }

        })
      }

    });
    console.log("all routes checked - ending route checker");

    // Didnt find any matches so end here:
    next();

  }
}
