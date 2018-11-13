const EVENT_PLUGIN_ENABLED = "EVENT_PLUGIN_ENABLED";
const EVENT_PLUGIN_DISABLED = "EVENT_PLUGIN_DISABLED";

const EVENT_PLUGIN_LOADED = "EVENT_PLUGIN_LOADED";

const EVENT_PLUGIN_MODULE_ENABLED = "EVENT_PLUGIN_MODULE_ENABLED";
const EVENT_PLUGIN_MODULE_DISABLED = "EVENT_PLUGIN_MODULE_DISABLED";

/**
 * PluginService
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
    this.loaders = loaders;
    this.store = store;
    this.strategy = strategy;
    this.events = events;
  }

  /**
   * start
   * @description initialize plugin service
   * @public
   */
  start(){
    "use strict";
    this.scanForNewPlugins();
    this.events.on(EVENT_PLUGIN_LOADED, payload => {
      this.store.getEnabledPlugins().forEach(plugin => {
        if( plugin.getKey() === payload.plugin.getKey() ){
          payload.plugin.enable();
          console.log("[PluginService] Plugin ("+pluginKey+") has been detected and was enabled on last run - so attempting to reenable");
        }
      });
    });
    
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
        allPlugins.push(loader.listPlugins(filter));
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
      this.events.emit(EVENT_PLUGIN_ENABLED, {
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
      this.events.emit(EVENT_PLUGIN_DISABLED, {
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
   * @public
   */
  getPluginModules(pluginKey){
    "use strict";
    var modules = [];
    var plugin = this.getPlugin(pluginKey);
    if( plugin !== null){
      modules = plugin.getModules();
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
      module = this.getPluginModules(pluginKey).getModuleByKey(moduleKey);
    }catch(e){
      console.warn("[PluginService] Attempted to locate module ("+moduleKey+") for plugin ("+pluginKey+") but it was not found");
    }
    return module;
  }

  /**
   * enableModule
   * @description Enable a single plugin(s) module
   * @argument {int} pluginKey
   * @argument {int} moduleKey
   * @public
   */
  enableModule(pluginKey, moduleKey){
    "use strict";
    var module = this.getPluginModule(pluginKey, moduleKey);
    if( module !== null){
      this.store.enablePluginModule(pluginKey,moduleKey);
      this.events.emit(EVENT_PLUGIN_MODULE_ENABLED, {
        "module" : module
      });
    }else{
      console.warn("[PluginService] Attempted to enable module ("+moduleKey+") for plugin ("+pluginKey+") but it was not found - skipping");
    }
  }

  /**
   * disableModule
   * @description Disable a single plugin(s) module
   * @argument {int} pluginKey
   * @argument {int} moduleKey
   * @public
   */
  disableModule(pluginKey, moduleKey){
    "use strict";
    var module = this.getPluginModule(pluginKey, moduleKey);
    if( module !== null){
      this.store.disablePluginModule(pluginKey,moduleKey);
      this.events.emit(EVENT_PLUGIN_MODULE_DISABLED, {
        "module" : module
      });
    }else{
      console.warn("[PluginService] Attempted to disable module ("+moduleKey+") for plugin ("+pluginKey+") but it was not found - skipping");
    }
  }

}

module.exports = PluginService;