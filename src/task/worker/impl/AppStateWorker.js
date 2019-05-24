const App = require("../../../app/App");
const Task = require("../../../task/Task");
const TaskWorker = require("../../../task/worker/TaskWorker");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");

/**
 * @description Worker which responds to App enable/disable tasks
 *              1: Save new App state to Store
 *              2: Close Task as success
 */
class AppStateWorker extends TaskWorker {
  /**
   * @argument {TaskManager} taskManager The taskManager this worker should register with for new tasks
   * @argument {AppStore} store The store to use for persisting any data
   * @argument {AppLoader} appLoader use this appLoader to fetch an App from a URL
   * @argument {Config} config Optional Runtime config
   */
  constructor({
    taskManager,
    store,
    appLoader,
    config = new Config(),
    logger = new Logger(config)
  } = {}) {
    super(...arguments);
    this.taskManager = taskManager;
    this.worker1 = null;
    this.worker2 = null;
    this.store = store;
    this.appLoader = appLoader;
    this.config = config;
    this.logger = logger;
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
   * @argument {Task} task The task to be processed
   */
  processTask(task) {
    "use strict";
    return new Promise(async (resolve, reject) => {
      const payload = task.getPayload();
      const app = payload && payload.app ? payload.app : null;

      // Make sure there is a URL to load
      if (!app) {
        let errMsg = `Task with id(${task.getId()}) is missing an app in the payload`;
        task.emit(Task.events.ERROR_EVENT, errMsg);
        return reject(new Error(errMsg));
      }
      // Toggle disable or enable based on payload
      const appData = app.toJSON();
      appData.enabled =
        payload.state && payload.state === App.states.DISABLED ? false : true;
      const updatedApp = new App(appData);
      // Save it to the Store
      await this.store.update(appData.id, updatedApp);

      // Close off the task
      task.emit(Task.events.SUCCESS_EVENT, updatedApp);
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
    this._running = true;
    return new Promise(async (resolve, reject) => {
      const taskManager = this.taskManager;
      // Register an Enable Worker
      try {
        this.worker1 = await taskManager.process(
          Task.types.APP_ENABLE,
          async task => {
            await this.processTask(task);
          }
        );
        this.logger.info(
          "AppState Worker (handles enable) [%s] has started and is ready to process tasks",
          this.worker1.id
        );
      } catch (err) {
        this.logger.error("AppLoad Worker failed to start %o", err);
        reject();
      }
      // Register a Disable Worker
      try {
        this.worker2 = await taskManager.process(
          Task.types.APP_DISABLE,
          async task => {
            await this.processTask(task);
          }
        );
        this.logger.info(
          "AppState Worker (handles disable) [%s] has started and is ready to process tasks",
          this.worker2.id
        );
      } catch (err) {
        this.logger.error("AppLoad Worker failed to start %o", err);
        reject();
      }
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
      if (this.worker1 && this.worker1.close) {
        await this.worker1.close();
      }
      this.worker1 = null;
      if (this.worker2 && this.worker2.close) {
        await this.worker2.close();
      }
      this.worker2 = null;
      this._running = false;
      resolve();
    });
  }
}

module.exports = AppStateWorker;
