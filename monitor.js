var monitor = require('node-docker-monitor');
const exec = require('child_process').exec;
var GATEWAY;
var pluginManager = require('./lib/plugin-manager').getInstance();

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
      if( container["Ports"][0] && container["Ports"][0]["PublicPort"]){
        pluginManager.addPlugin(container["Ports"][0]["PublicPort"]);
      }
    },

    onContainerDown: function(container) {
        //console.log('\n\nContainer down: ', container)
    }
});

pluginManager.on("plugin:added", function(plugin){
  console.log("New plugin detected and loaded: ", plugin.getKey());
})
