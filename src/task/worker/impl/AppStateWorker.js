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
   * @argument {Config} config Optional Runtime config
   */
  constructor({
    taskManager,
    store,
    config = new Config(),
    logger = new Logger(config)
  } = {}) {
    super(...arguments);
    this.taskManager = taskManager;
    this.worker1 = null;
    this.worker2 = null;
    this.store = store;
    this.config = config;
    this.logger = logger.child({
      config: { "service.name": "AppStateWorker" }
    });
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
  processTask(task, worker) {
    "use strict";
    return new Promise(async (resolve, reject) => {
      const payload = task.getPayload();
      const app = payload && payload.app ? payload.app : null;
      const appId = app.getId ? app.getId() : app.id;
      this.logger.info(
        "Worker (id=%s) is processing Task(id=%s) with payload(%o)",
        worker.id,
        task.getId(),
        payload
      );

      // Make sure there is a URL to load
      if (!app || !appId) {
        let errMsg = `Task with id(${task.getId()}) is missing an app in the payload`;
        task.emit(Task.events.ERROR_EVENT, errMsg);
        return reject(new Error(errMsg));
      }
      // Toggle disable or enable based on payload
      const persistedApp = this.store.read(appId);
      try {
        persistedApp.enabled =
          task.getType() === Task.types.APP_DISABLE ? false : true;
      } catch (e) {
        let errMsg = `Task(${task.getId()}) : Error Modifying state for app : ${appId}, Error: ${e}`;
        task.emit(Task.events.ERROR_EVENT, errMsg);
        return reject(new Error(errMsg));
      }

      // Save it to the Store
      try {
        await this.store.update(persistedApp.id, persistedApp);
      } catch (e) {
        let errMsg = `Task(${task.getId()}) : Error Saving state for app : ${appId}, Error: ${e}`;
        task.emit(Task.events.ERROR_EVENT, errMsg);
        return reject(new Error(errMsg));
      }

      // Close off the task
      const latestApp = new App(persistedApp);
      task.emit(Task.events.SUCCESS_EVENT, latestApp);
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
            await this.processTask(task, this.worker1);
          }
        );
        this.logger.verbose(
          "TaskWorker (AppEnable) [%s] has started and is ready to process tasks",
          this.worker1.id
        );
      } catch (err) {
        this.logger.error("TaskWorker (AppEnable) failed to start %o", err);
        reject();
      }
      // Register a Disable Worker
      try {
        this.worker2 = await taskManager.process(
          Task.types.APP_DISABLE,
          async task => {
            await this.processTask(task, this.worker2);
          }
        );
        this.logger.verbose(
          "TaskWorker (AppDisable) [%s] has started and is ready to process tasks",
          this.worker2.id
        );
      } catch (err) {
        this.logger.error("TaskWorker (AppDisable) failed to start %o", err);
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
