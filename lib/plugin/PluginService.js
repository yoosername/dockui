const Plugin = require('./Plugin');
const EventEmitter = require('events');

/**
 * PluginService service
 */
 class PluginService extends EventEmitter{
   constructor() {
     super();
     this.plugins = [];
   }

   addPlugin(containerId, port, network){
     var plugin = new Plugin(this, network, port, containerId);
     this.plugins.push(plugin);
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

   // TODO: For all the getters check state of plugin beforereturning

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
