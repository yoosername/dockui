var express = require('express');
var requestProxy = require('express-request-proxy');
var app = express();
var monitor = require('node-docker-monitor');
const exec = require('child_process').exec;
var GATEWAY;
var PluginManager = require('./lib/plugins/PluginManager');

// Get the gateway for this monitor container
exec("netstat -nr | grep '^0\.0\.0\.0' | awk '{print $2}'", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  //console.log(`stdout: ${stdout}`);
  GATEWAY = stdout;
  GATEWAY = GATEWAY.replace(/\n/,'');
  PluginManager.setGateway(GATEWAY);
});

// Start docker monitor listening for container up and down
// and add and remove relevant plugins
monitor({
    onContainerUp: function(container) {
      if( container["Ports"][0] && container["Ports"][0]["PublicPort"]){
        PluginManager.addPlugin(container.Id, container["Ports"][0]["PublicPort"]);
      }
    },
    onContainerDown: function(container) {
        PluginManager.removePluginsForContainer(container.Id);
    }
});

// Serve the plugins as a JSON endpoint
app.get('/rest/api/1.0/plugins', function (req, res) {
  var plugins = [];
  PluginManager.getPlugins().forEach(function(p){
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

// Serve the plugins rest endpoints
app.get('/rest/plugins/:pluginKey/:moduleKey', function (req, res) {

  var gateway = PluginManager.getGateway();
  var plugin = PluginManager.getPluginByKey(req.params.pluginKey);
  var port = plugin.getPort();
  var module = plugin.getModuleByKey(req.params.moduleKey);
  var base = module.getBase();
  var url = "http://"+gateway+":"+port+base;

  console.log("rest url is: ", url);

  var proxy = requestProxy({
      cache: false,
      url: url
  });

  return proxy(req, res);

});

// Proxy plugin resources directly via module lookup
app.get('/static/:pluginKey/:moduleKey/*', function(req, res){

  var gateway = PluginManager.getGateway();
  var plugin = PluginManager.getPluginByKey(req.params.pluginKey);
  var port = plugin.getPort();
  var module = plugin.getModuleByKey(req.params.moduleKey);
  var base = module.getBase();
  var path = req.params[0];
  console.log("extra path is: ", path);
  var url = "http://"+gateway+":"+port+base+path;
  console.log("attempting to proxy the following resource: ", url);

  var proxy = requestProxy({
      cache: false,
      url: url
  });

  return proxy(req, res);

});

// Serve plugin webpages under /plugins by plugin and module key
app.get('/plugins/:pluginKey/webpages/:moduleKey', function (req, res) {

  var plugin = PluginManager.getPluginByKey(req.params.pluginKey);

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

app.listen(80, function () {
  console.log("Docker plugin monitor listening on port 80");
});

// TODO: Add a hook mechanism, such that plugins cant receive a POST for various events
// TODO: For example when a plugin is added or removed or various other events
// TODO: Need to add a WebHook module so that plugins can register for events
// TODO: Add a broadcast endpoint for sending custom events to.
// TODO: That way a plugin can broadcast a custom event and other plugins can
// TODO: register to receive the events e.g. via POST or Websockets

PluginManager.on("plugin:added", function(plugin){
  console.log("Loaded Plugin from container (", plugin.getContainerId(), ") with key: ", plugin.getKey());
})

PluginManager.on("plugin:removed", function(plugin){
  console.log("Removed plugin from container (", plugin.getContainerId(), ") with key: ", plugin.getKey());
})

PluginManager.on("module:added", function(module){
  console.log("Loaded plugin module (", module.getName(),") for plugin: ", module.getPlugin().getKey());
})
