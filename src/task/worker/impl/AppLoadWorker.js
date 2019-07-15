const Task = require("../../../task/Task");
const TaskWorker = require("../../../task/worker/TaskWorker");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");
const App = require("../../../app/App");

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
    this.logger = logger.child({ config: { "service.name": "AppLoadWorker" } });
    this._running = false;

    process.on("unhandledRejection", (reason, p) => {
      console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
      // application specific logging, throwing an error, or other logic here
    });
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
  processTask(task, worker) {
    "use strict";
    return new Promise(async (resolve, reject) => {
      let payload;
      let url;
      let permission;
      let app;
      let errors = [];

      try {
        payload = task.getPayload();
        url = payload.url;
        permission = payload.permission;
      } catch (e) {}

      // Make sure there is a URL to load
      if (!url) {
        errors.push(
          `Task with id(${task.getId()}) is missing a url in the payload`
        );
      }

      // Make sure there is a Permission set
      if (!permission) {
        errors.push(
          `Task with id(${task.getId()}) is missing a permission in the payload`
        );
      }

      // Stop here if errors
      if (errors && errors.length > 0) {
        task.emit(Task.events.ERROR_EVENT, errors);
        return reject(new Error(errors));
      }

      this.logger.debug(
        "Worker (id=%s) is processing Task(id=%s) to load (%s) with permission (%s)",
        worker.id,
        task.getId(),
        url,
        permission
      );

      // Try to load the App from the URL
      try {
        app = await this.appLoader.load({ url, permission });
        // Make sure it isnt already loaded
        // TODO: Generate the ID from an Apps Hash so its unique and test that way instead.
        const existingApps = this.store.find(doc => {
          return (
            doc.docType === App.DOCTYPE &&
            doc.baseUrl === app.getBaseUrl() &&
            doc.key === app.getKey()
          );
        });
        if (existingApps && existingApps.length && existingApps.length > 0) {
          throw new Error(
            `This App(id=${app.getKey()}, baseUrl=${app.getBaseUrl()}) already exists - skipping`
          );
        }
      } catch (e) {
        let errMsg = `Task(${task.getId()}) : There was a problem loading the App descriptor from url(${url}) : ${e}`;
        task.emit(Task.events.ERROR_EVENT, errMsg);
        return reject(new Error(errMsg));
      }

      try {
        // Save App to Store
        // Need to serialize with toJSON first or some adapters like lokiJs will accidently use
        // the build in toJSON method istead of its own decorated one ( thus losing db meta info )
        const appJSON = app.toJSON();
        // Store modules individually first
        appJSON.modules.forEach(module => {
          this.store.create(module);
        });
        // Now store the App itself
        this.store.create(appJSON);
        // Close off the task
        task.emit(Task.events.SUCCESS_EVENT, app);
        return resolve(app);
      } catch (e) {
        let errMsg = `Task(${task.getId()}) : Error loading App from URL : ${url}, error : ${e}`;
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
          Task.types.APP_LOAD,
          async task => {
            try {
              await this.processTask(task, this.worker);
            } catch (e) {}
          }
        );
        this.logger.verbose(
          "Task Worker (AppLoad) [%s] has started and is ready to process tasks",
          this.worker.id
        );
        resolve();
      } catch (err) {
        this.logger.error("Task Worker (AppLoad) failed to start %o", err);
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
