const  {
  PLUGIN_SERVICE_STARTED_EVENT,
  PLUGIN_SERVICE_SHUTDOWN_EVENT,
  PLUGIN_LOADED_EVENT,
  PLUGIN_ENABLED_EVENT,
  PLUGIN_DISABLED_EVENT,
  PLUGIN_MODULE_ENABLED_EVENT,
  PLUGIN_MODULE_DISABLED_EVENT
} = require("../../constants/events");

const  {
  PluginServiceValidationError
} = require("../../constants/errors");

/**
 * @class PluginService
 * @description Default PluginService is NoOp. Here for ref
 * @public
 * @constructor
 */
class PluginService{

  constructor(
    loaders,
    store,
    strategy,
    events
  ){
    this._running = false;
    this.loaders = loaders;
    this.store = store;
    this.strategy = strategy;
    this.events = events;
    this.validateArguments();
  }

  validateArguments(){
    if(
      !this.loaders||
      !this.store||
      !this.strategy||
      !this.events){
      throw new PluginServiceValidationError();
    }
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

      // Hook up listener to enable plugins when they are loaded
      this.events.on(PLUGIN_LOADED_EVENT, payload => {
        this.store.getEnabledPlugins().forEach(plugin => {
          if( plugin.getKey() === payload.plugin.getKey() ){
            payload.plugin.enable();
            console.log("[PluginService] Plugin ("+payload.plugin.getKey()+") has been detected and was enabled on last run - so attempting to reenable");
          }
        });
      });

      // Kick off scanning for new plugins
      this.scanForNewPlugins();

      // Flag that we are now running
      this._running = true; 

      // Notify listeners that we have started
      this.events.trigger(PLUGIN_SERVICE_STARTED_EVENT);

    }

  }

  /**
   * @method shutdown
   * @description shutdown plugin service gracefully
   * @public
   */
  shutdown(){
    "use strict";
    // Tell Loaders to stop loading plugins
    this.stopScanningForNewPlugins();
    // Flag that we are not running
    this._running = false;
    // Notify listeners that we have started
    this.events.trigger(PLUGIN_SERVICE_SHUTDOWN_EVENT);
  }

  /**
   * scanForNewPlugins
   * @description Process new plugins using the Plugin Loaders
   * @public
   */
  scanForNewPlugins(){
    "use strict";
    this.loaders.forEach(loader => {
      try{
        loader.scanForNewPlugins();
      }catch(error){}
    });
  }

  /**
   * stopScanningForNewPlugins
   * @description Tell Loaders we dont want any more scanning until called again
   * @public
   */
  stopScanningForNewPlugins(){
    "use strict";
    this.loaders.forEach(loader => {
      try{
        loader.stopScanningForNewPlugins();
      }catch(error){}
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
    this.loaders.forEach(loader => {
      try{
        allPlugins.push(loader.getPlugins(filter));
      }catch(error){}
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
      this.store.enablePlugin(pluginKey);
      this.events.trigger(PLUGIN_ENABLED_EVENT, {
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
      this.store.disablePlugin(pluginKey);
      this.events.trigger(PLUGIN_DISABLED_EVENT, {
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
      this.store.enablePluginModule(pluginKey,moduleKey);
      this.events.trigger(PLUGIN_MODULE_ENABLED_EVENT, {
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
      this.store.disablePluginModule(pluginKey,moduleKey);
      this.events.trigger(PLUGIN_MODULE_DISABLED_EVENT, {
        "module" : module
      });
    }else{
      console.warn("[PluginService] Attempted to disable module ("+moduleKey+") for plugin ("+pluginKey+") but it was not found - skipping");
    }
  }

}

module.exports = PluginService;