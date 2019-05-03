/**
 * @description Worker which responds to App Load requests by processing the descriptor
 *              and attempting to:
 *              1: Load App using AppLoader
 *              2: Save App state to Store
 *              3: Notify Loaded so AppService can rehydrate itself from Store
 */
class AppLoaderTaskWorker {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  /**
   * @description initialize and start Worker
   */
  start() {
    "use strict";
    // TODO: This
  }

  /**
   * @description Gracefully shutdown Worker
   */
  shutdown() {
    "use strict";
    // TODO: This
  }
}

module.exports = AppLoaderTaskWorker;
