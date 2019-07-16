const Task = require("../../Task");
const TaskWorker = require("../TaskWorker");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");
const App = require("../../../app/App");
const Module = require("../../../app/module/Module");

/**
 * @description Worker which responds to App Load requests by processing the descriptor
 *              and attempting to:
 *              1: Load App using AppLoader
 *              2: Save App state to Store
 *              3: Close Task as success
 */
class AppReloadWorker extends TaskWorker {
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
    this.logger = logger.child({
      config: { "service.name": "AppReloadWorker" }
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
      let app;
      let reloadedApp;
      let url;
      let permission;
      let errors = [];

      try {
        payload = task.getPayload();
        app = payload.app;
        url = app.getBaseUrl() + "/" + app.getDescriptorName();
        permission = payload.permission
          ? payload.permission
          : app.getPermission();
      } catch (e) {}

      // Validate that permission is a valid one
      permission = permission.toUpperCase();
      if (!Object.keys(App.permissions).includes(permission)) {
        errors.push(
          `Task with id(${task.getId()}) has been passed an invalid permission(${permission})`
        );
      }

      // Make sure there is an App to reload
      if (!app) {
        errors.push(
          `Task with id(${task.getId()}) is missing an app in the payload`
        );
      }

      // Stop here if errors
      if (errors && errors.length > 0) {
        task.emit(Task.events.ERROR_EVENT, new Error(errors));
        return reject(new Error(errors));
      }

      this.logger.debug(
        "Worker (id=%s) is processing Task(id=%s) to Reload app(key=%s) from url(%s) with permission (%s)",
        worker.id,
        task.getId(),
        app.getKey(),
        url,
        permission
      );

      // Try to load the App from the URL ( we will use the values to overwrite the old one )
      try {
        reloadedApp = await this.appLoader.load({ url, permission });
      } catch (e) {
        let errMsg = `Task(${task.getId()}) : There was a problem reloading the App descriptor from url(${url}) : ${e}`;
        task.emit(Task.events.ERROR_EVENT, errMsg);
        return reject(new Error(errMsg));
      }

      try {
        // Fetch existing App from store
        // Copy values over it ( except for the Id )
        // Need to serialize with toJSON first or some adapters like lokiJs will accidently use
        // the build in toJSON method istead of its own decorated one ( thus losing db meta info )

        let appJSON = this.store.read(app.getId());
        const existingAppId = appJSON.id;
        const existingEnabledStatus = appJSON.enabled;
        let reloadedAppJSON = reloadedApp.toJSON();
        let reloadedModules = [];

        // Store modules individually first
        reloadedAppJSON.modules.forEach(module => {
          // If module exists in original update it

          let existingModule = this.store.find(mod => {
            return mod.docType === Module.DOCTYPE && mod.key === module.key;
          })[0];

          if (existingModule) {
            //existingModule = existingModule.toJSON();

            // Save the existing Id and AppId
            const existingModuleId = existingModule.id;

            // Update the original module with all the new data (reapplying the existing id, appId)
            let combinedModule = Object.assign({}, existingModule, module, {
              id: existingModuleId,
              appId: existingAppId
            });

            // Update the original in the store
            this.store.update(existingModuleId, combinedModule);
            reloadedModules.push(combinedModule);
          } else {
            // Otherwise this module never existed before ( with this key ) so save it as new
            this.store.create(module);
            const storedModule = this.store.read(module.id);
            reloadedModules.push(storedModule);
          }
        });

        // Update the original with all the new data
        let combinedApp = Object.assign({}, appJSON, reloadedAppJSON, {
          id: existingAppId,
          enabled: existingEnabledStatus,
          modules: reloadedModules
        });

        // Now update the App data
        this.store.update(existingAppId, combinedApp);
        const savedApp = new App(combinedApp);

        // Close off the task
        task.emit(Task.events.SUCCESS_EVENT, savedApp);
        return resolve(savedApp);
      } catch (e) {
        let taskId = task && task.getId ? task.getId() : "unknown";
        let errMsg = `Task(${taskId}) : Error Reloading App from URL : ${url}, error : ${e}`;
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
          Task.types.APP_RELOAD,
          async task => {
            try {
              await this.processTask(task, this.worker);
            } catch (e) {}
          }
        );
        this.logger.verbose(
          "Task Worker (AppReload) [%s] has started and is ready to process tasks",
          this.worker.id
        );
        resolve();
      } catch (err) {
        this.logger.error("Task Worker (AppReload) failed to start %o", err);
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

module.exports = AppReloadWorker;
