const { Config } = require("../../config/Config");

/**
 * @description TaskWorkers listen to TaskManager queue for certain types of task
 *              and process them when requested
 */
class TaskWorker {
  constructor({ taskManager, config = new Config() } = {}) {
    this.taskManager = taskManager;
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
