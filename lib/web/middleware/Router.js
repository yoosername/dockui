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
    var routes = PluginService.getModulesByType("route");

    routes.forEach(function(route){
      var routeString = route.getRoute();
      var matchKeys = [];
      var routeRegex = toRegexp(routeString, matchKeys);
      var map = toMap(matchKeys);
      var path = route.getPath();
      if( routeRegex && path ){

        var match = routeRegex.exec(orig);
        if( match ){

          // If here then the route matches. We build the path and rewrite it and end here
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

        }
      }
    });

    // Didnt find any matches so end here:
    return next();

  }
}
