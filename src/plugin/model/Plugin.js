const  {
  validateShapes
} = require("../../util/validate");


/**
 * @class Plugin
 * @description Represents a single plugin.
 * @argument {PluginLoader} pluginLoader - The loader which loaded us.
 * @argument {string} pluginKey - The unique key.
 * @argument {Array} pluginModules - The plugins loaded modules.
 * @argument {EventService} eventService - The Event service.
 */
class Plugin{

  constructor(
    pluginKey,
    pluginDescriptor,
    pluginLoader, 
    pluginModuleLoaders,
    eventService
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"PluginLoader","object":pluginLoader},
      {"shape":"PluginModuleLoader","object":pluginModuleLoaders[0]},
      {"shape":"PluginDescriptor","object":pluginDescriptor},
      {"shape":"EventService","object":eventService}
    ]);

    this.pluginLoader = pluginLoader; 
    this.pluginKey = pluginKey; 
    this.pluginDescriptor = pluginDescriptor;
    this.pluginModuleLoaders = pluginModuleLoaders;
    this.eventsService = eventService;

    this.modules = [];
    this.registerPluginModules();

  }

  /**
   * @method getKey
   * @description return the unique key of this Plugin
   */
  getKey(){
    return this.pluginKey;
  }

  /**
   * @method getPluginLoader
   * @description return the loader which loaded this Plugin
   */
  getPluginLoader(){
    return this.pluginLoader;
  }

  /**
   * @method getPluginDescriptor
   * @description return the Plugin Descriptor this Plugin was parsed from
   */
  getPluginDescriptor(){
    return this.pluginDescriptor;
  }

  /**
   * @method getEventService
   * @description return event service
   */
  getEventService(){
    return this.eventService;
  }

  /**
   * @method getPluginModuleLoaders
   * @description return PluginModule loaders which are available for parsing Module Descriptors
   */
  getPluginModuleLoaders(){
    return this.pluginModuleLoaders;
  }

  /**
   * @method enable
   * @description delegate enabling and disabling to our loader
   */
  enable(){
    this.pluginLoader.enablePlugin(this);
  }

  /**
   * @method disable
   * @description delegate enabling and disabling to our loader
   */
  disable(){
    this.pluginLoader.disablePlugin(this);
  }

  /**
   * @method registerPluginModules
   * @description Try to parse the pluginDescriptor and load 
   * all the modules in it using any of the passed in ModuleLoaders
   * Unloadable modules are created anyway but automatically disabled
   */
  registerPluginModules(){

    this.pluginDescriptor.modules.forEach(moduleDescriptor =>{
      var module = null;
      this.pluginModuleLoaders.forEach(moduleLoader =>{
        try{
          if(moduleLoader.canLoadModuleDescriptor(moduleDescriptor)){
            module = moduleLoader.loadModuleFromDescriptor(moduleDescriptor);
          }
        }catch(e){
          // Not bothered
        }
      });
      if(!module){
        module = new UnloadableModule();
      }
    });

  }

}

module.exports = Plugin;