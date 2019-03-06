const { validateShapes } = require("../../util/validate");

/**
 * @description Hook to add custom events handler logic into AppService
 */
class LifecycleEventsStrategy {
  /**
   * @argument {EventService} eventService - The Event Service to listen to
   * @argument {AppStore} appStore - The persistent state storage to use
   */
  constructor(eventService, appStore) {
    validateShapes([
      { shape: "EventService", object: eventService },
      { shape: "AppStore", object: appStore }
    ]);

    this.eventService = eventService;
    this.appStore = appStore;
  }

  /**
   * @description Used to add event listeners and other setup tasks
   */
  setup() {
    console.warn(
      "[LifecycleEventsStrategy] setup - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Used to remove event listeners and other shutdown tasks
   */
  teardown() {
    console.warn(
      "[LifecycleEventsStrategy] teardown - NoOp implementation - this should be extended by child classes"
    );
  }
}

module.exports = LifecycleEventsStrategy;
