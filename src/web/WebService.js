const { Config } = require("../config/Config");

/**
 * @description Wraps the intialization, configuration and starting/stopping of a web server
 *              and associated routes etc.
 */
class WebService {
  /**
   * @argument {AppService} appService The AppService for interacting with Apps
   * @argument {Config} config The Runtime Config
   */
  constructor({ appService, taskManager, config = new Config() } = {}) {
    this.appService = appService;
    this.taskManager = taskManager;
    this.config = config;
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
   * @async
   */
  start() {
    "use strict";

    console.warn(
      "[WebService] start - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Gracefully shutdown web server
   * @async
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
   * @description Helper to get the passed in Rutime Config
   * @returns {Config} the Config
   */
  getConfig() {
    "use strict";
    console.warn(
      "[WebService] getConfig - NoOp implementation - this should be extended by child classes"
    );
  }
}

module.exports = WebService;
