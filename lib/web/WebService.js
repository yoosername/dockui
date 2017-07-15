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

app.use(function(req,res,next){
  console.log("\n\n[WebService] : New (%s) Request to %s", req.method, req.path);
  next();
})
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

  console.log("[Plugins json hardcoded middleware]");

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
    console.log("[Rest/Static Middleware] : attempting to proxy resource: ", url);

    // If module requires scopes then check if the user has them
    // The AuthService will decide how to check this based on the req object and the required scopes
    if( module.requiredScopes() != null ){

      console.log("[Rest/Static Middleware] : Resource requires auth scopes : ", module.requiredScopes());
       AuthService.testUserHasScopes(req, module.requiredScopes())
          .then(function(){
            console.log("[Rest/Static Middleware] : User has the required scopes ");
            proxy(req, res);
          })
          .catch(function(error){
            if( error instanceof Errors.UserNotAuthenticatedError ){
              console.log("[Rest/Static Middleware] : User is not authenticated and needs to be");
              AuthService.authenticate(req)
                .then(function(val){
                  //  if we get here then users JWT with scopes is now on the req object so proceed
                  console.log("[Rest/Static Middleware] : User has been successfully authenticated");
                  proxy(req, res);
                })
                .catch(function(authError){

                  // If couldnt authenticate the user then send 401
                  if( authError instanceof Errors.UserAuthenticationFailedError ){
                    console.log("[Rest/Static Middleware] : Authentication failed");
                    res.status(401).send(authError);
                  }
                  // If redirect requested then send redirect
                  else if( authError instanceof Errors.AuthenticationRedirectRequestedError ){
                    console.log("[Rest/Static Middleware] : Authentication redirect requested");
                    res.redirect(authError.url);
                  }
                  // If no handlers available
                  else if( authError instanceof Errors.NoAuthenticationProvidersCanHandleRequestError ){
                    console.log("[Rest/Static Middleware] : Authentication failed, no handler could authenticate the request");
                    res.status(401).send({status: 401, msg: "Authentication was request but no handlers can fulfill this request"});
                  }
                  // Anything else send 500
                  else{
                    console.log("[Rest/Static Middleware] : Authentication failed, unknown error: ", authError);
                    res.status(500).send(authError);
                  }
                })
            }
            else if( error instanceof Errors.UserMissingRequiredScopesError ){
              console.log("[Rest/Static Middleware] : User is authenticated but doesnt have the required scopes");
              res.status(401).send(error);
            }
          })

    }else{
      console.log("[Rest/Static Middleware] : No auth scopes are required");
      proxy(req, res);
    }
    // To set agressive Cache-Control
    //res.setHeader('Cache-Control', 'public, max-age=31557600');
    //proxy(req, res);
  }else{
    console.log("[Rest/Static Middleware] : Cant find plugin: ", req.params.pluginKey);
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

  var plugin = PluginService.getPluginByKey(req.params.pluginKey);

  if(!plugin){
    console.log("[Webpage middleware] : Cannot find plugin by key: " + req.params.pluginKey);
    res.status(404).send("Cannot find plugin by key: " + req.params.pluginKey);
    return;
  }

  var webpageModule = plugin.getModuleByKey(req.params.moduleKey);
  if(!webpageModule){
    console.log("[Webpage middleware] : Cannot find module "+req.params.moduleKey+" for plugin: " + req.params.pluginKey);
    res.status(404).send("Cannot find module "+req.params.moduleKey+" for plugin: " + req.params.pluginKey);
    return;
  }

  //TODO: If Auth scopes are requested then we need to checkforscopes and or authenticate first.

  console.log("[Webpage middleware] : Starting template processing");
  webpageModule.proxy(req, res).then(function(template){
    // CacheService.add(req.url, context.template);
    // Pipe the resolved response into the current response;
    console.log("[Webpage middleware] : Template was processed successfully, sending to client");
    res.send(template);
  }).catch(function(error){

    // If redirect requested then send redirect
    if( error instanceof Errors.AuthenticationRedirectRequestedError ){
      console.log("[Webpage middleware] : Auth redirect requested, sending redirect to: ", error.url);
      res.redirect(error.url);
    }else{
      console.log("[Webpage middleware] : Error rendering WebPage module("+req.params.moduleKey+") Error: "+error);
      res.status(404).send("Error rendering WebPage module("+req.params.moduleKey+") Error: "+error);
    }

  })

});

// Start the web server
var start = function(port, callback){

    server.listen(port, callback);

}

module.exports = {
  start : start
}
