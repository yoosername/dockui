const Task = require("../../Task");
const TaskWorker = require("../TaskWorker");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");
const Module = require("../../../app/module/Module");

/**
 * @description Worker which responds to App UnLoad requests by processing the descriptor
 *              and attempting to:
 *              1: Load App using AppLoader
 *              2: Save App state to Store
 *              3: Close Task as success
 */
class AppUnLoadWorker extends TaskWorker {
  /**
   * @argument {TaskManager} taskManager The taskManager this worker should register with for new tasks
   * @argument {AppStore} store The store to use for persisting any data
   * @argument {Config} config Optional Runtime config
   * @argument {Logger} logger Optional Runtime Logger
   */
  constructor({
    taskManager,
    store,
    config = new Config(),
    logger = new Logger(config)
  } = {}) {
    super(...arguments);
    this.taskManager = taskManager;
    this.worker = null;
    this.store = store;
    this.config = config;
    this.logger = logger.child({
      config: { "service.name": "AppUnLoadWorker" }
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
      let payload;
      let app;
      let errors = [];

      try {
        payload = task.getPayload();
        app = payload.app;
      } catch (e) {}

      // Make sure there is a URL to load
      if (!app) {
        errors.push(
          `Task with id(${task.getId()}) is missing an app in the payload`
        );
      }
      // Stop here if errors
      if (errors && errors.length > 0) {
        task.emit(Task.events.ERROR_EVENT, errors);
        return reject(new Error(errors));
      }

      this.logger.debug(
        "Worker (id=%s) is processing Task(id=%s) to unload app(%s)",
        worker.id,
        task.getId(),
        app.getKey()
      );

      try {
        // Delete all the modules for this app ( using whats in the store )
        const storedModules = this.store.find(doc => {
          return doc.docType === Module.DOCTYPE && doc.appId === app.getId();
        });
        //app.getModules().forEach(module => {
        storedModules.forEach(module => {
          this.logger.debug("Attempting to delete module %s", module.id);
          this.store.delete(module.id);
        });

        // Then delete the app itself from the Store
        this.store.delete(app.getId());
        // Close off the task
        task.emit(Task.events.SUCCESS_EVENT, app);
        return resolve(app);
      } catch (e) {
        let errMsg = `Task(${task.getId()}) : Error unLoading App (id=${app.getId()})`;
        this.logger.error(
          "Error unloading App(id=%s), Error = %o",
          app.getId(),
          e
        );
        task.emit(Task.events.ERROR_EVENT, errMsg);
        return reject(new Error(errMsg));
      }
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
          Task.types.APP_UNLOAD,
          async task => {
            try {
              await this.processTask(task, this.worker);
            } catch (e) {}
          }
        );
        this.logger.verbose(
          "Task Worker (AppUnLoad) [%s] has started and is ready to process tasks",
          this.worker.id
        );
        resolve();
      } catch (err) {
        this.logger.error("Task Worker (AppUnLoad) failed to start %o", err);
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

module.exports = AppUnLoadWorker;
