const Plugin = require('./Plugin');
const EventEmitter = require('events');
const yaml = require('js-yaml');
var request = require('requestretry');

const PLUGIN_DESCRIPTOR_AVAILABILITY_DELAY = 2000;
const PLUGIN_JSON_DESCRIPTOR_NAME = "plugin.json";
const PLUGIN_YAML_DESCRIPTOR_NAME = "plugin.yml";
const PLUGIN_DESCRIPTOR_DEFAULT_PORT = 8080;

/**
 * PluginService service
 */
 class PluginService extends EventEmitter{
   constructor() {
     super();
     this.date = new Date();
     this.plugins = [];
   }

   addPlugin(containerId, port, network){
     var descriptorServicePort = port;
     var self = this;

     fetchRemotePluginDescriptor(network, descriptorServicePort)
       .then(function(descriptor){

         // If descriptor is Yaml then parse into json first;
         if( typeof descriptor !='object' ){
           console.log("Got some Yaml need to process it first!! - nice");
           try {
              descriptor = yaml.safeLoad(descriptor);
              //console.log(doc);
            } catch (e) {
              //console.log(e);
            }
         }

         if(descriptor){
           var plugin = new Plugin(self, network, descriptorServicePort, containerId, descriptor);

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
         //console.log("Error loading plugin descriptor from container: ", containerId, port, error);
         // Silent fail
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

   getIsDevMode(){
     var devMode = (process.env.DEV_MODE) ? true : false;
     return devMode;
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

module.exports = new PluginService();

/**
 * Get plugin json from from running container e.g. http://gateway:publicPort/plugin.json
 * @param gateway : String
 * @param port : String
 */
function fetchRemotePluginDescriptor(gateway, port) {
  gateway = (typeof gateway == "string" && gateway != "undefined") ? gateway.replace(/(\r\n|\n|\r)/gm,"") : PLUGIN_DESCRIPTOR_DEFAULT_GATEWAY;
  port = port || PLUGIN_DESCRIPTOR_DEFAULT_PORT;

  var pluginJSONDescriptorUrl = `http://${gateway}:${port}/${PLUGIN_JSON_DESCRIPTOR_NAME}`;
  var pluginYAMLDescriptorUrl = `http://${gateway}:${port}/${PLUGIN_YAML_DESCRIPTOR_NAME}`;
  console.log("Attempting to Fetch plugin descriptor from: ", pluginJSONDescriptorUrl);

  return request({
    url: pluginJSONDescriptorUrl,
    json:true,
    fullResponse: false // (default) To resolve the promise with the full response or just the body
  })
  .then(function(body){
    if(typeof body != "object"){
      console.log("Cannot find "+PLUGIN_JSON_DESCRIPTOR_NAME+" so attempting to Fetch plugin descriptor from: ", pluginYAMLDescriptorUrl);
      return request({
        url: pluginYAMLDescriptorUrl,
        json:false,
        fullResponse: false // (default) To resolve the promise with the full response or just the body
      })
    }else{
      return body;
    }
  })

}
