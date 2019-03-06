const {
  APP_LOAD_STARTED_EVENT,
  APP_LOAD_COMPLETE_EVENT,
  APP_LOAD_FAILED_EVENT
} = require("../../../constants/events");

const { log } = require("./helper");

const LifecycleEventsStrategy = require("../LifecycleEventsStrategy");

/**
 * @description Hook to add custom events handler logic into AppService
 */
class DefaultLifecycleEventsStrategy extends LifecycleEventsStrategy {
  /**
   * @argument {EventService} eventService - The Event Service to listen to
   * @argument {AppStore} appStore - The persistent state storage to use
   */
  constructor(eventService, appStore) {
    super(eventService, appStore);
  }

  /**
   * @description Used to add event listeners and other setup tasks
   */
  setup() {
    this.eventService.addListener(APP_LOAD_STARTED_EVENT, log);
    this.eventService.addListener(APP_LOAD_COMPLETE_EVENT, log);
    this.eventService.addListener(APP_LOAD_FAILED_EVENT, log);
  }

  /**
   * @description Used to remove event listeners and other shutdown tasks
   */
  teardown() {
    // Remove all our listeners.
    this.eventService.removeListener(APP_LOAD_STARTED_EVENT, log);
    this.eventService.removeListener(APP_LOAD_COMPLETE_EVENT, log);
    this.eventService.removeListener(APP_LOAD_FAILED_EVENT, log);
  }
}

module.exports = DefaultLifecycleEventsStrategy;