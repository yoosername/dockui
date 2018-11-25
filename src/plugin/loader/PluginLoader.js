const  {
  validateShapes
} = require("../../util/validate");


/**
 * @class PluginLoader
 * @description Load plugins from a specific location( e.g. DB, Remote web service etc )
 * @argument {Array} pluginModuleLoaders - The plugins loaded modules.
 * @argument {EventService} eventService - The Event service.
 */
class PluginLoader{

  constructor(
    pluginModuleLoaders,
    eventService
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"PluginModuleLoader","object":pluginModuleLoaders[0]},
      {"shape":"EventService","object":eventService}
    ]);

    this.pluginModuleLoaders = pluginModuleLoaders;
    this.eventsService = eventService;

    this.loadedPlugins = [];

  }

  /**
   * @method scanForNewPlugins
   * @description Starting checking some location for new plugins 
   *              and attempt to load them when found
   *              Loading them involves fetching PluginDescriptor
   *              and creating a new Plugin passing it in. The Plugin will
   *              attempt to Load its own Modules and use Events for lifecycle.
   */
  scanForNewPlugins(){
    // Look in some location
    // When Plugin detected
    // Try to load its descriptor
    // If successfully loaded try to create a Plugin
  }

  /**
   * @method stopScanningForNewPlugins
   * @description Stop checking for new plugins until scan is called again.
   */
  stopScanningForNewPlugins(){
    // Implement this
  }

  /**
   * @method getPlugins
   * @description Return all loaded plugins.
   */
  getPlugins(){
    // Implement this
  }

  /**
   * @method enablePlugin
   * @description Hook to do any tasks relating to enabling the plugin
   *              e.g. notify the remote webservice that it has been enabled
   */
  enablePlugin(){
    // Implement this
  }

  /**
   * @method disablePlugin
   * @description Hook to do any tasks relating to disabling the plugin
   *              e.g. notify the remote webservice that it has been disabled
   */
  disablePlugin(){
    // Implement this
  }

}

module.exports = PluginLoader;