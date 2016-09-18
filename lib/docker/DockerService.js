const EventEmitter = require('events');
const monitor = require('node-docker-monitor');
const exec = require('child-process-promise').exec;
var GATEWAY;


var lookupGateway = function(){

  // Get the gateway for this monitor container
  return exec("netstat -nr | grep '^0\.0\.0\.0' | awk '{print $2}'")
    .then(function(result){

      if (result.error) {
        console.error(`exec error: ${result.error}`);
        return null;
      }

      return result.stdout.replace(/\n/,'');;

    })

}
/**
 * DockerService service
 */
 class DockerService extends EventEmitter{
   constructor() {
     super();
     this.gateway = "127.0.0.1";
     this.monitoring = false;
   }

   getGateway(){
     return this.gateway;
   }

   isMonitoring(){
     return this.monitoring;
   }

   startMonitor(onContainerUp, onContainerDown){

     var self = this;

     return lookupGateway()
     .then(function(gateway){
       self.gateway = gateway;

       monitor({
           onContainerUp: onContainerUp,
           onContainerDown: onContainerDown
       });
       console.log("DockerService is monitoring - gateway set to ", self.gateway);

       self.monitoring = true;
     })

   }

 }

module.exports = new DockerService();

/**
 * Get plugin json from from running container e.g. http://gateway:publicPort/plugin.json
 * @param gateway : String
 * @param port : String
 * @param successCb : Function
 * @param errorCb : Function
 */
function fetchRemotePluginDescriptor(gateway, port) {
  gateway = (typeof gateway == "string" && gateway != "undefined") ? gateway.replace(/(\r\n|\n|\r)/gm,"") : PLUGIN_DESCRIPTOR_DEFAULT_GATEWAY;
  port = port || PLUGIN_DESCRIPTOR_DEFAULT_PORT;

  var pluginDescriptorUrl = `http://${gateway}:${port}/${PLUGIN_DESCRIPTOR_NAME}`;
  //console.info("Attempting to Fetch plugin descriptor from: ", pluginDescriptorUrl);

  return request({
    url: pluginDescriptorUrl,
    json:true,
    fullResponse: false // (default) To resolve the promise with the full response or just the body
  })

}
