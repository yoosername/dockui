var express = require('express');
var requestProxy = require('express-request-proxy');
var PluginService = require('../plugin/PluginService');
var CacheService = require("./CacheService");
var AuthService = require("./AuthService");
var app = express();
var server = require('http').createServer(app);

const Authenticator = require("./middleware/Authenticator");
const Router = require('./middleware/Router');
const Cache = require("./middleware/Cache");

// Router looks for Route modules and if it finds one will rewrite the request and continue
app.use(Router());

// Now we know what route we definately want, lookup any auth strategy and apply associated rules
//app.use(Authenticator());

// Cache middleware uses the CacheService to decide wether to serve urls from cache
// based on associated Caching strategy
app.use(Cache());

// Some site static resources to ensure they are loaded before plugin resources ( .eg. define )
// TODO: Remove this once ResourcesModule implements proper ordering
// SHouldnt serve anything from here, just from modules
app.use('/s', express.static(__dirname + '/static'));

// Serve a JSON endpoint for PluginManager Orchestration
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

// Endpoint for REST PluginModules
app.get('/rest/plugins/:pluginKey/:moduleKey', function (req, res) {

  var plugin = PluginService.getPluginByKey(req.params.pluginKey);
  var network = plugin.getNetwork();
  var port = plugin.getPort();
  var module = plugin.getModuleByKey(req.params.moduleKey);
  var base = module.getBase();
  var url = "http://"+network+":"+port+base;

  console.log("rest url is: ", url);

  var proxy = requestProxy({
      cache: false,
      url: url
  });

  return proxy(req, res);

});

// Endpoint for static plugin resources defined in ResourcesModule
app.get('/static/:pluginKey/:moduleKey/*', function(req, res){

  var plugin = PluginService.getPluginByKey(req.params.pluginKey);
  if( plugin ){
    var network = plugin.getNetwork();
    var port = plugin.getPort();
    var module = plugin.getModuleByKey(req.params.moduleKey);
    var base = module.getBase();
    var path = req.params[0];
    console.log("extra path is: ", path);
    var url = "http://"+network+":"+port+base+path;
    console.log("attempting to proxy the following resource: ", url);

    var proxy = requestProxy({
        cache: false,
        url: url
    });

    // To set agressive Cache-Control
    //res.setHeader('Cache-Control', 'public, max-age=31557600');
    return proxy(req, res);
  }else{
    res.status(404).send("Cannot find plugin "+req.params.pluginKey);
  }

});

// Endpoint for plugin webpageModules
app.get('/plugins/:pluginKey/webpages/:moduleKey', function (req, res) {

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

  webpageModule.render().then(function(context){
    CacheService.add(req.url, context.template);
    console.log("cached the url: ", req.url);
    res.send(context.template);
  }).catch(function(error){
    res.status(404).send("Error rendering WebPage module "+req.params.moduleKey+error);
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
