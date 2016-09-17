const Plugin = require('./Plugin');
const EventEmitter = require('events');
var request = require('requestretry');

const PLUGIN_DESCRIPTOR_AVAILABILITY_DELAY = 2000;
const PLUGIN_DESCRIPTOR_NAME = "plugin.json";
const PLUGIN_DESCRIPTOR_DEFAULT_PORT = 8080;
const PLUGIN_DESCRIPTOR_DEFAULT_GATEWAY = "127.0.0.1";

/**
 * PluginManager service
 */
 class PluginManager extends EventEmitter{
   constructor() {
     super();
     this.date = new Date();
     this.plugins = [];
     this.gateway = PLUGIN_DESCRIPTOR_DEFAULT_GATEWAY;
   }

   addPlugin(containerId, port){
     var descriptorServicePort = port;
     var self = this;

     fetchRemotePluginDescriptor(self.gateway, descriptorServicePort)
       .then(function(descriptor){
         if(descriptor){
           var plugin = new Plugin(self, descriptorServicePort, containerId, descriptor);
           plugin.on("module:added", function(module){
             self.emit("module:added", module);
           });

           plugin.loadModules();

           self.plugins.push(plugin);
           self.emit('plugin:added', plugin);
         }else{
           console.log("found container (", containerId, ") without pluginDescriptor - ignoring");
         }
       })
       .catch(function(error){
         console.log("Error loading plugin descriptor from container: ", containerId, port, error);
       });

   }

   removePluginsForContainer(containerId){
     var filteredPlugins = [];
     console.log("deleting plugins for containerId: ", containerId);
     this.plugins.forEach(function(plugin){
       if(plugin.getContainerId() != containerId){
         filteredPlugins.push(plugin);
       }else{
         this.emit('plugin:removed', plugin);
       }
     }.bind(this));
     this.plugins = filteredPlugins;
   }

   getGateway(){
     return this.gateway;
   }

   setGateway(gateway){
     this.gateway = gateway;
   }

   getPlugins(){
     return this.plugins;
   }

   getModulesByType(moduleType){
     var foundModules = [];
     this.plugins.forEach(function(plugin){
       plugin.getModules().forEach(function(module){
         if(module.getType() == moduleType){
           foundModules.push(module);
         }
       })
     });
     return foundModules;
   }

   getModuleByKey(moduleKey){
     var foundModule = null;
     this.plugins.forEach(function(plugin){
       plugin.getModules().forEach(function(module){
         if(module.getKey() == moduleKey){
           foundModule = module;
         }
       })
     });
     return foundModule;
   }

   getPluginByKey(pluginKey){

     var foundPlugin = null;
     this.plugins.forEach(function(plugin){
       if( plugin.getKey() == pluginKey ){
         foundPlugin = plugin;
       }
     });

     return foundPlugin;
   }

 }

module.exports = new PluginManager();

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
