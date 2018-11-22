/**
 * Represents a single plugin.
 * @constructor
 * @param {PluginLoader} loader - The loader which loaded this plugin.
 * @param {string} key - The unique key.
 * @param {Array} modules - The plugins modules.
 * @param {EventService} events - The Event service.
 */
 function Plugin(pluginLoader, pluginKey, modules, eventsService){
   this.pluginLoader = pluginLoader;
   this.pluginKey = pluginKey;
   this.modules = modules;
   this.events = eventsService;
 }

 Plugin.prototype.getKey = function(){
   return this.pluginKey;
 };

 Plugin.prototype.enable = function(){
   this.pluginLoader.enable(this);
 };

 Plugin.prototype.disable = function(){
   this.pluginLoader.disable(this);
 };

 Plugin.prototype.getModules = function(filter){
   if(filter && this.modules.length > 0){
     return this.modules.filter(filter);
   }
   return this.modules;
 };

 Plugin.prototype.getModuleByKey = function(key){
   return this.modules[key];
 };

 Plugin.prototype.enableModuleByKey = function(key){
   this.getModuleByKey(key).enable();
 };

 Plugin.prototype.disableModuleByKey = function(key){
  this.getModuleByKey(key).disable();
 };


 module.exports = Plugin;