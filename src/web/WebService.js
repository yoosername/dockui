const { validateShapes } = require("../util/validate");

/**
 * @description Wraps the intialization, configuration and starting/stopping of a web server
 *              and associated routes etc.
 */
class WebService {
  /**
   * @argument {AppService} appService The AppService for interacting with Apps
   * @argument {EventService} eventService The EventService to use for web events
   */
  constructor(appService, eventService) {
    validateShapes([
      { shape: "AppService", object: appService },
      { shape: "EventService", object: eventService }
    ]);

    this.server = null;
    this.appService = appService;
    this.eventService = eventService;
  }

  /**
   * @description setup required Middleware and Routes
   */
  setupMiddleware() {
    "use strict";

    console.warn(
      "[WebService] setupMiddleware - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description initialize and start web server
   */
  start() {
    "use strict";

    console.warn(
      "[WebService] start - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Gracefully shutdown web server
   */
  shutdown() {
    "use strict";
    console.warn(
      "[WebService] shutdown - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Is the webserver currently serving requests
   * @returns {Boolean} Returns true if the WebService is currently running
   */
  isRunning() {
    "use strict";
    console.warn(
      "[WebService] isRunning - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Helper to get the passed in AppService
   * @returns {AppService} the AppService
   */
  getAppService() {
    "use strict";
    console.warn(
      "[WebService] getAppService - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Helper to get the passed in EventService
   * @returns {EventService} the EventService
   */
  getEventService() {
    "use strict";
    console.warn(
      "[WebService] getEventService - NoOp implementation - this should be extended by child classes"
    );
  }
}

module.exports = WebService;
