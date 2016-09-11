var monitor = require('node-docker-monitor');
const exec = require('child_process').exec;
var GATEWAY;
var pluginManager = require('./lib/plugins/PluginManager').getInstance();

exec("netstat -nr | grep '^0\.0\.0\.0' | awk '{print $2}'", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  //console.log(`stdout: ${stdout}`);
  GATEWAY = stdout;
  pluginManager.setGateway(GATEWAY);
});

monitor({
    onContainerUp: function(container) {
      //console.log(container);
      if( container["Ports"][0] && container["Ports"][0]["PublicPort"]){
        pluginManager.addPlugin(container.Id, container["Ports"][0]["PublicPort"]);
      }
    },

    onContainerDown: function(container) {
        pluginManager.removePluginByContainerId(container.Id);
    }
});

pluginManager.on("plugin:added", function(plugin){
  console.log("Loaded Plugin from container (", plugin.getContainerId(), ") with key: ", plugin.getKey());
})

pluginManager.on("plugin:removed", function(plugin){
  console.log("Removed plugin from container (", plugin.getContainerId(), ") with key: ", plugin.getKey());
})

pluginManager.on("module:added", function(module){
  console.log("Loaded plugin module (", module.getName(),") for plugin: ", module.getPluginKey());
})
