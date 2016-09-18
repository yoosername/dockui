var express = require('express');
var requestProxy = require('express-request-proxy');
var app = express();
var PluginService = require('../plugin/PluginService');
var DockerService = require('../docker/DockerService');


// TODO: Add PKI auth middleware
// TODO: It should verify the user and simply add UserInfo into every request
// TODO: If a requst is proxied then the backend simply specifies whether it requires
// TODO: aLoggedInUser or something, if it gets called it can pull user info from the headers.

// Serve the plugins as a JSON endpoint
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

// Serve the plugins rest endpoints
app.get('/rest/plugins/:pluginKey/:moduleKey', function (req, res) {

  var gateway = PluginService.getGateway();
  var plugin = PluginService.getPluginByKey(req.params.pluginKey);
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

  var gateway = PluginService.getGateway();
  var plugin = PluginService.getPluginByKey(req.params.pluginKey);
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


// TODO: Add a hook mechanism, such that plugins cant receive a POST for various events
// TODO: For example when a plugin is added or removed or various other events
// TODO: Need to add a WebHook module so that plugins can register for events
// TODO: Add a broadcast endpoint for sending custom events to.
// TODO: That way a plugin can broadcast a custom event and other plugins can
// TODO: register to receive the events e.g. via POST or Websockets

PluginService.on("plugin:added", function(plugin){
  console.log("Plugin ["+plugin.getKey()+"] loaded successfully from docker container [", plugin.getContainerId(), "] on port ", plugin.getPort());
})

PluginService.on("plugin:removed", function(plugin){
  console.log("Plugin ["+plugin.getKey()+"] was removed successfully from container [", plugin.getContainerId(), "]");
})

PluginService.on("module:added", function(module){
  console.log("Module ["+module.getKey()+"] loaded successfully from plugin [", module.getPlugin().getKey(), "]");
})


var startDockerMonitor = function(){

  return DockerService.startMonitor(
    function(container) {
      if( container["Ports"][0] && container["Ports"][0]["PublicPort"]){
        PluginService.addPlugin(container.Id, container["Ports"][0]["PublicPort"]);
      }
    },
    function(container) {
        PluginService.removePluginsForContainer(container.Id);
    }
  )
  .then(function(){
    PluginService.setGateway(DockerService.getGateway());
  })
  .catch(function(error){
    console.log("Error: ", error);
  })

}

var start = function(port){

  return startDockerMonitor()
  .then(function(){

    app.listen(port, function () {
      console.log("WebService started listening on host port ", port);
    });

  })

}

module.exports = {
  start : start
}
