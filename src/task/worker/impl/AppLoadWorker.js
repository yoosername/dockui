const Task = require("../../../task/Task");
const TaskWorker = require("../../../task/worker/TaskWorker");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");

/**
 * @description Worker which responds to App Load requests by processing the descriptor
 *              and attempting to:
 *              1: Load App using AppLoader
 *              2: Save App state to Store
 *              3: Close Task as success
 */
class AppLoadWorker extends TaskWorker {
  /**
   * @argument {TaskManager} taskManager The taskManager this worker should register with for new tasks
   * @argument {AppStore} store The store to use for persisting any data
   * @argument {AppLoader} appLoader use this appLoader to fetch an App from a URL
   * @argument {Config} config Optional Runtime config
   * @argument {Logger} logger Optional Runtime Logger
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
    this.worker = null;
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
      const url = payload && payload.url ? payload.url : null;

      // Make sure there is a URL to load
      if (!url) {
        let errMsg = `Task with id(${task.getId()}) is missing a url in the payload`;
        task.emit(Task.events.ERROR_EVENT, errMsg);
        return reject(new Error(errMsg));
      }
      // Try to load the App from the URL
      const app = await this.appLoader.load(url);
      if (!app) {
        let errMsg = `Task(${task.getId()}) : Error loading App from URL : ${url}`;
        task.emit(Task.events.ERROR_EVENT, errMsg);
        return reject(new Error(errMsg));
      }
      // Save it to the Store
      await this.store.create(app);

      // Close off the task
      task.emit(Task.events.SUCCESS_EVENT, app);
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
      try {
        this.worker = await taskManager.process(
          Task.types.APP_LOAD,
          async task => {
            await this.processTask(task);
          }
        );
        this.logger.info(
          "AppLoad Worker [%s] has started and is ready to process tasks",
          this.worker.id
        );
        resolve();
      } catch (err) {
        this.logger.error("AppLoad Worker failed to start %o", err);
        reject();
      }
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
      this._running = false;
      resolve();
    });
  }
}

module.exports = AppLoadWorker;
