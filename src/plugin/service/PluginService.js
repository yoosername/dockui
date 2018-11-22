const  {
  PLUGIN_SERVICE_STARTING_EVENT,
  PLUGIN_SERVICE_STARTED_EVENT,
  PLUGIN_SERVICE_SHUTTING_DOWN_EVENT,
  PLUGIN_SERVICE_SHUTDOWN_EVENT,
  PLUGIN_ENABLED_EVENT,
  PLUGIN_DISABLED_EVENT,
  PLUGIN_MODULE_ENABLED_EVENT,
  PLUGIN_MODULE_DISABLED_EVENT
} = require("../../constants/events");

const  {
  PluginServiceValidationError
} = require("../../constants/errors");

const  {
  validateShapes
} = require("../../util/validate");

/**
 * @class PluginService
 * @description Use plugin loaders to detect and load plugins and
 *              a LifecycleStrategy to enable and disable plugins based on custom rules
 */
class PluginService{

  constructor(
    pluginLoaders,
    pluginStore,
    lifecycleEventsStrategy,
    eventService
  ){
    
    this._running = false;
    var lifecycleEventsStrategyInst = lifecycleEventsStrategy;

    try{

      // if lifecycleEventStrategy is a function then create the instance now
      if(typeof lifecycleEventsStrategyInst==="function"){
        lifecycleEventsStrategyInst = new lifecycleEventsStrategyInst(this, eventService, pluginStore);
      }

      // Validate our args using ducktyping utils. (figure out better way to do this later)
      validateShapes([
        {"shape":"PluginLoader","object":pluginLoaders[0]}, 
        {"shape":"PluginStore","object":pluginStore}, 
        {"shape":"LifecycleEventsStrategy","object":lifecycleEventsStrategyInst}, 
        {"shape":"EventService","object":eventService}
      ]);

    }catch(e){
      throw new PluginServiceValidationError(e);
    }

    this.pluginLoaders = pluginLoaders;
    this.pluginStore = pluginStore;
    this.eventService = eventService;
    this.lifecycleEventsStrategy = lifecycleEventsStrategyInst;
    
  }

  /**
   * @method start
   * @description initialize plugin service
   * @public
   */
  start(){
    "use strict";

    // If we are not already started
    if( this._running !== true ){


      // Notify listeners that we are starting up
      this.eventService.trigger(PLUGIN_SERVICE_STARTING_EVENT);

      // setup PluginEventLifecycleStrategy to handle events
      this.lifecycleEventsStrategy.setup();

      // Kick off scanning for new plugins
      this.scanForNewPlugins();

      // Flag that we are now running
      this._running = true; 

      // Notify listeners that we have started
      this.eventService.trigger(PLUGIN_SERVICE_STARTED_EVENT);

    }

  }

  /**
   * @method shutdown
   * @description shutdown plugin service gracefully
   * @public
   */
  shutdown(){
    "use strict";

    // If we are not already shutdown
    if( this._running == true ){

      // Notify listeners that we are shutting down
      this.eventService.trigger(PLUGIN_SERVICE_SHUTTING_DOWN_EVENT);

      // Tell Loaders to stop loading plugins
      this.stopScanningForNewPlugins();

      // Teardown event handlers
      this.lifecycleEventsStrategy.teardown();

      // Flag that we are not running
      this._running = false;

      // Notify listeners that we have shutdown successfully
      this.eventService.trigger(PLUGIN_SERVICE_SHUTDOWN_EVENT);

    }
  }

  /**
   * scanForNewPlugins
   * @description Process new plugins using the Plugin Loaders
   * @public
   */
  scanForNewPlugins(){
    "use strict";
    this.pluginLoaders.forEach(pluginLoader => {
        pluginLoader.scanForNewPlugins();
    });
  }

  /**
   * stopScanningForNewPlugins
   * @description Tell Loaders we dont want any more scanning until called again
   * @public
   */
  stopScanningForNewPlugins(){
    "use strict";
    this.pluginLoaders.forEach(pluginLoader => {
        pluginLoader.stopScanningForNewPlugins();
    });
  }

  /**
   * getPlugins
   * @description Get all plugins from all Loaders
   * @argument {Function} filter : filter the list of plugins using this test
   * @public
   */
  getPlugins(filter){
    "use strict";
    var allPlugins = [];
    this.pluginLoaders.forEach(pluginLoader => {
        allPlugins.push(pluginLoader.getPlugins(filter));
    });
    return allPlugins;
  }

  /**
   * getPlugin
   * @description Get single plugin by key
   * @argument {int} pluginKey
   * @public
   */
  getPlugin(pluginKey){
    "use strict";
    var plugin = null;
    try{
      plugin = this.getPlugins(plugin => plugin.getKey() === pluginKey)[0];
    }catch(e){
      console.warn("[PluginService] Attempted to locate plugin ("+pluginKey+") but it was not found");
    }
    return plugin;
  }

  /**
   * enablePlugin
   * @description Enable a single plugin
   * @argument {int} pluginKey
   * @public
   */
  enablePlugin(pluginKey){
    "use strict";
    var plugin = this.getPlugin(pluginKey);
    if( plugin !== null){
      this.pluginStore.enablePlugin(pluginKey);
      this.eventService.trigger(PLUGIN_ENABLED_EVENT, {
        "plugin" : plugin
      });
    }else{
      console.warn("[PluginService] Attempted to enable plugin ("+pluginKey+") but it was not found - skipping");
    }
  }

  /**
   * disablePlugin
   * @description Disable a single plugin
   * @argument {int} pluginKey
   * @public
   */
  disablePlugin(pluginKey){
    "use strict";
    var plugin = this.getPlugin(pluginKey);
    if( plugin !== null){
      this.pluginStore.disablePlugin(pluginKey);
      this.eventService.trigger(PLUGIN_DISABLED_EVENT, {
        "plugin" : plugin
      });
    }else{
      console.warn("[PluginService] Attempted to disable plugin ("+pluginKey+") but it was not found - skipping");
    }
  }

  /**
   * getPluginModules(pluginKey)
   * @description Return a single plugin(s) module(s)
   * @argument {int} pluginKey
   * @argument {Function} filter
   * @public
   */
  getPluginModules(pluginKey, filter){
    "use strict";
    var modules = [];
    var plugin = this.getPlugin(pluginKey);
    if( plugin !== null){
      modules = plugin.getModules();
      if(filter && typeof filter === "function"){
        modules = modules.filter(filter);
      }
    }else{
      console.warn("[PluginService] Attempted to get modules for plugin ("+pluginKey+") but it was not found - skipping");
    }
    return modules;
  }

    /**
   * getPluginModules(pluginKey)
   * @description Return a single plugin(s) module(s)
   * @argument {int} pluginKey
   * @argument {int} moduleKey
   * @public
   */
  getPluginModule(pluginKey, moduleKey){
    "use strict";
    var module = null;
    try{
      module = this.getPluginModules(pluginKey, module => {
        return (module.getKey() === moduleKey);
      })[0];
    }catch(e){
      console.warn("[PluginService] Attempted to locate module ("+moduleKey+") for plugin ("+pluginKey+") but it was not found");
    }
    return module;
  }

  /**
   * enablePluginModule
   * @description Enable a single plugin(s) module
   * @argument {int} pluginKey
   * @argument {int} moduleKey
   * @public
   */
  enablePluginModule(pluginKey, moduleKey){
    "use strict";
    var module = this.getPluginModule(pluginKey, moduleKey);
    if( module !== null){
      this.pluginStore.enablePluginModule(pluginKey,moduleKey);
      this.eventService.trigger(PLUGIN_MODULE_ENABLED_EVENT, {
        "module" : module
      });
    }else{
      console.warn("[PluginService] Attempted to enable module ("+moduleKey+") for plugin ("+pluginKey+") but it was not found - skipping");
    }
  }

  /**
   * disablePluginModule
   * @description Disable a single plugin(s) module
   * @argument {int} pluginKey
   * @argument {int} moduleKey
   * @public
   */
  disablePluginModule(pluginKey, moduleKey){
    "use strict";
    var module = this.getPluginModule(pluginKey, moduleKey);
    if( module !== null){
      this.pluginStore.disablePluginModule(pluginKey,moduleKey);
      this.eventService.trigger(PLUGIN_MODULE_DISABLED_EVENT, {
        "module" : module
      });
    }else{
      console.warn("[PluginService] Attempted to disable module ("+moduleKey+") for plugin ("+pluginKey+") but it was not found - skipping");
    }
  }

}

module.exports = PluginService;