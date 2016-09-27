var express = require('express');
var requestProxy = require('express-request-proxy');
var PluginService = require('../plugin/PluginService');
var CacheService = require("./CacheService");
var app = express();
var server = require('http').createServer(app);

const Authenticator = require("./middleware/Authenticator");
const Router = require('./middleware/Router');
const Cache = require("./middleware/Cache");

app.use(Authenticator()); // Auth comes first for all endpoints

// TODO: Add cache middleware and CacheService.
// : Routes can call render() then add the result to the CacheService e.g.
// : CacheService.add("/the/path", RenderedTemplate, timeout)
// : The cache middleware will simply look in the CacheService for the path and if found
// : return the route immediately and go no further
// : It will also check for DEVMODE and if so ignore all caches
// Optionally set agressive Cache-Control e.g.
// res.setHeader('Cache-Control', 'public, max-age=31557600');


// Router looks for Route modules and if it finds one will rewrite the request and continue
app.use(Router());

app.use(Cache());

// Some site static resources to ensure they are loaded before plugin resources ( .eg. define )
app.use('/s', express.static(__dirname + '/static'));

// Serve the plugins as a JSON endpoint for use within admin pages
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

// Serve the plugin rest endpoints
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

// Proxy plugin resources directly via module lookup
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

    // Set agressive Cache-Control
    // If plugin changes we can remove the header later
    //res.setHeader('Cache-Control', 'public, max-age=31557600');
    return proxy(req, res);
  }else{
    res.status(404).send("Cannot find plugin "+req.params.pluginKey);
  }

});

// Serve plugin webpages under /plugins by plugin and module key
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

var start = function(port){

    server.listen(port, function () {
      console.log("WebService started listening on host port ", port);
    });

}

module.exports = {
  start : start
}
