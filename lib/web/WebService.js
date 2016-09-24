var express = require('express');
var requestProxy = require('express-request-proxy');
var PluginService = require('../plugin/PluginService');
var app = express();
var server = require('http').createServer(app);

const Authenticator = require("./middleware/Authenticator");
const Decorator = require("./middleware/Decorator");
const StaticResources = require("./middleware/StaticResources");

app.use(Authenticator()); // Auth comes first for all endpoints
// TODO: Add a CookieService to manage cookies added by modules serving pages
// TODO: For example to store state regarding sidebar minimised or maximised
// TODO: The webPage module can look up the current session cookies to see whether to make changes to the page render

//app.use(CookieService());
//app.use(StaticResources()); // add resources for decorator
//app.use(Decorator()); // decorate the page next
//app.use(StaticResources()); // add resources for decorated page

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

  return proxy(req, res);

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

  res.send(webpageModule.render());

});

var start = function(port){

    server.listen(port, function () {
      console.log("WebService started listening on host port ", port);
    });

}

module.exports = {
  start : start
}
