const  {
  PLUGIN_LOAD_STARTED_EVENT,
  PLUGIN_LOAD_COMPLETE_EVENT,
  PLUGIN_LOAD_FAILED_EVENT
} = require("../constants/events");

const  {
  validateShapes
} = require("../util/validate");

/**
 * @function logLoadStarted
 * @description When plugins load is attempted - log it
 */
function logLoadStarted(payload){
  "use strict";
  console.log("[PluginService] Plugin ("+payload.plugin.getKey()+") is being loaded...");
}

/**
 * @function enablePluginImmediatelyOnLoad
 * @description When plugins are loaded - enable them immediately
 */
function enablePluginImmediatelyOnLoad(payload){
  "use strict";
  this.pluginStore.getEnabledPlugins().forEach(pluginKey => {
    if( pluginKey === payload.plugin.getKey() ){
      payload.plugin.enable();
      console.log("[PluginService] Plugin ("+payload.plugin.getKey()+") has been loaded and is not listed as disabled so reenabling");
    }
  });
}

/**
 * @function logLoadFailed
 * @description When plugins load fails- log it
 */
function logLoadFailed(payload){
  "use strict";
  var error = (payload.error) ? payload.error : "";
  console.log("[PluginService] Plugin ("+payload.plugin.getKey()+") failed to load: ", error);
}

/**
 * @class LifecycleEventsStrategy
 * @description Hook to add custom events handler logic into PluginService
 */
class LifecycleEventsStrategy{

  constructor(pluginService, eventService, pluginStore){

    validateShapes([
      {"shape":"PluginService","object":pluginService}, 
      {"shape":"EventService","object":eventService}, 
      {"shape":"PluginStore","object":pluginStore}
    ]);

    this.pluginsService = pluginService;
    this.eventService = eventService;
    this.pluginStore = pluginStore;
  }

  /**
   * @method setup
   * @description Used to add event listeners and other setup tasks
   */
  setup(){
    this.eventService.on(PLUGIN_LOAD_STARTED_EVENT, logLoadStarted.bind(this));
    this.eventService.on(PLUGIN_LOAD_COMPLETE_EVENT, enablePluginImmediatelyOnLoad.bind(this));
    this.eventService.on(PLUGIN_LOAD_FAILED_EVENT, logLoadFailed.bind(this));
  }

  /**
   * @method teardown
   * @description Used to remove event listeners and other shutdown tasks
   */
  teardown(){
    // Remove all our listeners.
    this.eventService.removeListener(PLUGIN_LOAD_STARTED_EVENT, logLoadStarted);
    this.eventService.removeListener(PLUGIN_LOAD_COMPLETE_EVENT, enablePluginImmediatelyOnLoad);
    this.eventService.removeListener(PLUGIN_LOAD_FAILED_EVENT, logLoadFailed);
  }

}

module.exports = LifecycleEventsStrategy;