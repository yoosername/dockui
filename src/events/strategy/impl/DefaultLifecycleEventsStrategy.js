const {
  APPSERVICE_STARTING_EVENT,
  APPSERVICE_STARTED_EVENT,
  APPSERVICE_SHUTTING_DOWN_EVENT,
  APPSERVICE_SHUTDOWN_EVENT,
  WEBSERVICE_STARTING_EVENT,
  WEBSERVICE_STARTED_EVENT,
  WEBSERVICE_SHUTTING_DOWN_EVENT,
  WEBSERVICE_SHUTDOWN_EVENT
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
    this.eventService.addListener(APPSERVICE_STARTING_EVENT, log);
    this.eventService.addListener(APPSERVICE_STARTED_EVENT, log);
    this.eventService.addListener(APPSERVICE_SHUTTING_DOWN_EVENT, log);
    this.eventService.addListener(APPSERVICE_SHUTDOWN_EVENT, log);
    this.eventService.addListener(WEBSERVICE_STARTING_EVENT, log);
    this.eventService.addListener(WEBSERVICE_STARTED_EVENT, log);
    this.eventService.addListener(WEBSERVICE_SHUTTING_DOWN_EVENT, log);
    this.eventService.addListener(WEBSERVICE_SHUTDOWN_EVENT, log);
  }

  /**
   * @description Used to remove event listeners and other shutdown tasks
   */
  teardown() {
    this.eventService.removeListener(APPSERVICE_STARTING_EVENT, log);
    this.eventService.removeListener(APPSERVICE_STARTED_EVENT, log);
    this.eventService.removeListener(APPSERVICE_SHUTTING_DOWN_EVENT, log);
    this.eventService.removeListener(APPSERVICE_SHUTDOWN_EVENT, log);
    this.eventService.removeListener(WEBSERVICE_STARTING_EVENT, log);
    this.eventService.removeListener(WEBSERVICE_STARTED_EVENT, log);
    this.eventService.removeListener(WEBSERVICE_SHUTTING_DOWN_EVENT, log);
    this.eventService.removeListener(WEBSERVICE_SHUTDOWN_EVENT, log);
  }
}

module.exports = DefaultLifecycleEventsStrategy;
