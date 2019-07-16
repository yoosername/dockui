/**
 * @description Reactors listen to external events and use a passed in
 *              TaskManager to do work if necessary
 */
class Reactor {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  /**
   * @description initialize and start Reactor
   */
  start() {
    "use strict";

    console.warn(
      "[Reactor] start - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Gracefully shutdown Reactor
   */
  shutdown() {
    "use strict";
    console.warn(
      "[Reactor] shutdown - NoOp implementation - this should be extended by child classes"
    );
  }
}

module.exports = Reactor;
