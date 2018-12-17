const  {
  APP_LOAD_STARTED_EVENT,
  APP_LOAD_COMPLETE_EVENT,
  APP_LOAD_FAILED_EVENT
} = require("../../constants/events");

const  {
  validateShapes
} = require("../../util/validate");

const {
  enableAppOnLoad,
  log
} = require("./helper");

/**
 * @class LifecycleEventsStrategy
 * @description Hook to add custom events handler logic into AppService
 * @argument {EventService} eventService - The Event Service to listen to
 * @argument {AppStore} appStore - The persistent state storage to use
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
    this.eventService.addListener(APP_LOAD_STARTED_EVENT, log);
    this.eventService.addListener(APP_LOAD_COMPLETE_EVENT, log);
    this.eventService.addListener(APP_LOAD_COMPLETE_EVENT, enableAppOnLoad);
    this.eventService.addListener(APP_LOAD_FAILED_EVENT, log);
  }

  /**
   * @method teardown
   * @description Used to remove event listeners and other shutdown tasks
   */
  teardown(){
    // Remove all our listeners.
    this.eventService.removeListener(APP_LOAD_STARTED_EVENT, log);
    this.eventService.removeListener(APP_LOAD_COMPLETE_EVENT, log);
    this.eventService.removeListener(APP_LOAD_COMPLETE_EVENT, enableAppOnLoad);
    this.eventService.removeListener(APP_LOAD_FAILED_EVENT, log);
  }

}

module.exports = LifecycleEventsStrategy;