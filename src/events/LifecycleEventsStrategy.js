const  {
  APP_LOAD_STARTED_EVENT,
  APP_LOAD_COMPLETE_EVENT,
  APP_LOAD_FAILED_EVENT
} = require("../constants/events");

const  {
  validateShapes
} = require("../util/validate");

/**
 * @function logLoadStarted
 * @description When Apps load is attempted - log it
 */
function logLoadStarted(payload){
  "use strict";
  console.log("[LifecycleEventsStrategy] App ("+payload.app.getKey()+") is being loaded...");
}

/**
 * @function enableAppImmediatelyOnLoad
 * @description When Apps are loaded - enable them immediately
 */
function enableAppImmediatelyOnLoad(payload){
  "use strict";
  this.appStore.getEnabledApps().forEach(AppKey => {
    if( AppKey === payload.app.getKey() ){
      payload.app.enable();
      console.log("[LifecycleEventsStrategy] App ("+payload.app.getKey()+") has been loaded and is not listed as disabled so reenabling");
    }
  });
}

/**
 * @function logLoadFailed
 * @description When Apps load fails- log it
 */
function logLoadFailed(payload){
  "use strict";
  var error = (payload.error) ? payload.error : "";
  console.log("[LifecycleEventsStrategy] App ("+payload.app.getKey()+") failed to load: ", error);
}

/**
 * @class LifecycleEventsStrategy
 * @description Hook to add custom events handler logic into AppService
 */
class LifecycleEventsStrategy{

  constructor(eventService, appStore){

    validateShapes([
      {"shape":"EventService","object":eventService}, 
      {"shape":"AppStore","object":appStore}
    ]);
    
    this.eventService = eventService;
    this.appStore = appStore;
  }

  /**
   * @method setup
   * @description Used to add event listeners and other setup tasks
   */
  setup(){
    this.eventService.on(APP_LOAD_STARTED_EVENT, logLoadStarted.bind(this));
    this.eventService.on(APP_LOAD_COMPLETE_EVENT, enableAppImmediatelyOnLoad.bind(this));
    this.eventService.on(APP_LOAD_FAILED_EVENT, logLoadFailed.bind(this));
  }

  /**
   * @method teardown
   * @description Used to remove event listeners and other shutdown tasks
   */
  teardown(){
    // Remove all our listeners.
    this.eventService.removeListener(APP_LOAD_STARTED_EVENT, logLoadStarted);
    this.eventService.removeListener(APP_LOAD_COMPLETE_EVENT, enableAppImmediatelyOnLoad);
    this.eventService.removeListener(APP_LOAD_FAILED_EVENT, logLoadFailed);
  }

}

module.exports = LifecycleEventsStrategy;