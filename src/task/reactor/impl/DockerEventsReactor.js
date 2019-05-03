const Reactor = require("../Reactor");

/**
 * @description DockerEventsReactor listens to Docker events using a local
 *              Docker Socket and queues App Load requests upon detection
 */
class DockerEventsReactor extends Reactor {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  /**
   * @description initialize and start Reactor
   */
  start() {
    // TODO: This
  }

  /**
   * @description Gracefully shutdown Reactor
   */
  shutdown() {
    // TODO: This
  }
}

module.exports = DockerEventsReactor;
