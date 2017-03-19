var express = require('express');
var bodyParser = require("body-parser");
var requestProxy = require('express-request-proxy');
var PluginService = require('../plugin/PluginService');
var CacheService = require("./CacheService");
var AuthService = require("./AuthService");
var Errors = require("./Errors");

var app = express();
var server = require('http').createServer(app);

const Router = require('./middleware/Router');
const Cache = require("./middleware/Cache");

// Router looks for Route modules and if it finds one will rewrite the request and continue
app.use(Router());

// Cache middleware uses the CacheService to decide wether to serve urls from cache
// based on associated Caching strategy
app.use(Cache());

// Some site static resources to ensure they are loaded before plugin resources ( .eg. define )
// TODO: Remove this once ResourcesModule implements proper ordering
// SHouldnt serve anything from here, just from modules
app.use('/s', express.static(__dirname + '/static'));

// Serve a JSON endpoint for PluginManager Orchestration
// TODO: Move this into a plugin
app.get('/rest/api/1.0/plugins', function (req, res) {
  var plugins = [];
  PluginService.getPlugins().forEach(function(p){
    var plugin = {
      name : p.getName(),
      key : p.getKey(),
      modules : []
    }
    p.getModules().forEach(function(m){
      var module = {
        name : m.getName(),
        key : m.getKey(),
        type : m.getType()
      }
      plugin.modules.push(module);
    })
    plugins.push(plugin);
  });
  res.send(JSON.stringify(plugins));
});

/*
  PluginModuleProxy
     - Proxy a given request to a plugin module service endpoint
     - check if the module requires auth scopes and handle as necessary
*/
function PluginModuleProxy(req, res){
  var plugin = PluginService.getPluginByKey(req.params.pluginKey);

  if( plugin ){
    var module = plugin.getModuleByKey(req.params.moduleKey);
    var url = module.getUrl(req);
    var proxy = requestProxy({
        cache: false,
        url: url
    });
    console.log("attempting to proxy the following internal service resource: ", url);

    // If module requires scopes then check if the user has them
    // The AuthService will decide how to check this based on the req object and the required scopes
    if( module.requiredScopes() != null ){

       AuthService.testUserHasScopes(req, module.requiredScopes())
          .then(function(){
             console.log("User has the required Auth Scopes: %s", module.requiredScopes());
             proxy(req, res);
          })
          .catch(function(error){
            if( error instanceof Errors.UserNotAuthenticatedError ){
              AuthService.authenticate(req)
                .then(function(val){
                  //  if we get here then users JWT with scopes is now on the req object so proceed
                  console.log("User has been successfully authenticated");
                  proxy(req, res);
                })
                .catch(function(authError){

                  console.log(authError);

                  // If couldnt authenticate the user then send 401
                  if( authError instanceof Errors.UserAuthenticationFailedError ){
                    console.log("Auth failure seding redirect");
                    res.status(401).send(authError);
                  }
                  // If redirect requested then send redirect
                  else if( authError instanceof Errors.AuthenticationRedirectRequestedError ){
                    console.log("Auth redirect requested, sending redirect to: ", authError.url);
                    res.redirect(authError.url);
                  }
                  // If no handlers available
                  else if( authError instanceof Errors.NoAuthenticationProvidersCanHandleRequestError ){
                    console.log("Auth failure, no providers could handle request, return forbidden");
                    res.status(401).send({status: 401, msg: "Authentication was request but no handlers can fulfill this request"});
                  }
                  // Anything else send 500
                  else{
                    console.log("Auth redirect requested, sending redirect to: ", authError.url);
                    res.status(500).send(authError);
                  }
                })
            }
            else if( error instanceof Errors.UserMissingRequiredScopesError ){
              res.status(401).send(error);
            }
          })

    }else{
      console.log("No auth scopes required");
      proxy(req, res);
    }
    // To set agressive Cache-Control
    //res.setHeader('Cache-Control', 'public, max-age=31557600');
    //proxy(req, res);
  }else{
    res.status(404).send("Cannot find plugin "+req.params.pluginKey);
  }
}

// Endpoint for REST PluginModules
app.get('/rest/plugins/:pluginKey/:moduleKey/*', PluginModuleProxy);

// Endpoint for static plugin resources defined in ResourcesModule
app.get('/static/:pluginKey/:moduleKey/*', PluginModuleProxy);



// Endpoint for plugin webpageModules
// Does its own request proxying due to requirment to decorate the page as well
app.all('/plugins/:pluginKey/webpages/:moduleKey', function (req, res) {

  console.log("Request verb is: ", req.method);
  var plugin = PluginService.getPluginByKey(req.params.pluginKey);

  if(!plugin){
    res.status(404).send("Cannot find plugin by key: " + req.params.pluginKey);
    return;
  }

  var webpageModule = plugin.getModuleByKey(req.params.moduleKey);
  if(!webpageModule){
    res.status(404).send("Cannot find module "+req.params.moduleKey+" for plugin: " + req.params.pluginKey);
    return;
  }

  webpageModule.proxy(req, res).then(function(template){
    // CacheService.add(req.url, context.template);
    // Pipe the resolved response into the current response;
    res.send(template);
  }).catch(function(error){

    // If redirect requested then send redirect
    if( error instanceof Errors.AuthenticationRedirectRequestedError ){
      console.log("Auth redirect requested, sending redirect to: ", error.url);
      res.redirect(error.url);
    }else{
      res.status(404).send("Error rendering WebPage module("+req.params.moduleKey+") Error: "+error);
    }

  })

});

// Start the web server
var start = function(port){

    server.listen(port, function () {
      console.log("WebService started listening on host port ", port);
    });

}

module.exports = {
  start : start
}
