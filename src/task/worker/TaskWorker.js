const { Config } = require("../../config/Config");
const Logger = require("../../log/Logger");
const EventEmitter = require("events");

/**
 * @description TaskWorkers listen to TaskManager queue for certain types of task
 *              and process them when requested
 */
class TaskWorker extends EventEmitter {
  constructor({
    taskManager,
    store,
    appLoader,
    config = new Config(),
    logger = new Logger(config)
  } = {}) {
    super();
    this.taskManager = taskManager;
    this.store = store;
    this.appLoader = appLoader;
    this.config = config;
    this.logger = logger;
  }

  /**
   * @description initialize and start TaskWorker
   */
  start() {
    "use strict";

    console.warn(
      "[TaskWorker] start - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Gracefully shutdown TaskWorker
   */
  shutdown() {
    "use strict";
    console.warn(
      "[TaskWorker] shutdown - NoOp implementation - this should be extended by child classes"
    );
  }
}

module.exports = TaskWorker;
