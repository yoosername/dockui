const Task = require("../../../task/Task");

/**
 * @description Worker which responds to App Load requests by processing the descriptor
 *              and attempting to:
 *              1: Load App using AppLoader
 *              2: Save App state to Store
 *              3: Notify Loaded so AppService can rehydrate itself from Store
 */
class AppLoaderTaskWorker {
  /**
   * @argument {TaskManager} taskManager The taskManager this worker should register with for new tasks
   * @argument {AppStore} store The store to use for persisting any data
   * @argument {AppLoader} appLoader use this appLoader to fetch an App from a URL
   * @argument {Config} config Optional Runtime config
   */
  constructor(taskManager, store, appLoader, config) {
    this.taskManager = taskManager;
    this.worker = null;
    this.store = store;
    this.appLoader = appLoader;
    this.config = config;
    this._running = false;
  }

  /**
   * @description Return the taskManager we are using
   */
  getTaskManager() {
    "use strict";
    return this.taskManager;
  }

  /**
   * @description Return the Store we are using
   */
  getStore() {
    "use strict";
    return this.store;
  }

  /**
   * @description Return the AppLoader we are using
   */
  getAppLoader() {
    "use strict";
    return this.appLoader;
  }

  /**
   * @description Return the Config we are using
   */
  getConfig() {
    "use strict";
    return this.config;
  }

  /**
   * @description Are we currently running
   */
  isRunning() {
    "use strict";
    return this._running;
  }

  /**
   * @description Process a Single Task when called by the taskManager
   */
  processTask() {
    "use strict";
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  /**
   * @description initialize and start Worker
   */
  start() {
    "use strict";
    if (this.isRunning()) {
      return Promise.resolve();
    }
    return new Promise(async (resolve, reject) => {
      const taskManager = this.taskManager;
      this.worker = await taskManager.process(
        Task.types.APP_LOAD,
        async task => {
          await this.processTask(task);
        }
      );
      resolve();
    });
  }

  /**
   * @description Gracefully shutdown Worker
   */
  shutdown() {
    "use strict";
    if (!this.isRunning()) {
      return Promise.resolve();
    }
    return new Promise(async (resolve, reject) => {
      if (this.worker && this.worker.close) {
        await this.worker.close();
      }
      this.worker = null;
      resolve();
    });
  }
}

module.exports = AppLoaderTaskWorker;
