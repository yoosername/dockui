const AppService = require("../AppService");
const App = require("../../App");
const Module = require("../../module/Module");
const ModuleFactory = require("../../module/factory/ModuleFactory");
const Task = require("../../../task/Task");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");

/**
 * @description This SimpleAppService performs the following functionality:
 *              - loads state from the passedin store
 *              - Uses passedin TaskManager to schedule modifications to the system
 *              - refreshes its state by listening to events on the TaskManager and associated Tasks.
 */
class SimpleAppService extends AppService {
  /**
   * @param {TaskManager} taskManager - TaskManager is used to orchestrate changes to the system.
   * @param {AppStore} store - Store is used for loading persisted state.
   * @param {Config} config - The runtime config
   * @param {Logger} logger - optional passed in Logger instance
   */
  constructor({
    taskManager,
    store,
    config = new Config(),
    logger = new Logger(config)
  } = {}) {
    super(taskManager, store, config, logger);
    this.logger = logger.child({ config: { "service.name": "AppService" } });
    this._running = false;
  }

  /**
   * @description Return if the AppStore is currently running or not
   * @returns {Boolean} true if the appStore is running or false if not
   */
  isRunning() {
    return this._running;
  }

  /**
   * @async
   * @description Initialize and start the AppService (and if necessary required services)
   * @returns {Promise} Promise which resolves once started
   */
  start() {
    return new Promise(async (resolve, reject) => {
      this._running = true;
      this.logger.info("App Service has started");
      this.emit(AppService.SERVICE_STARTED_EVENT);
      resolve();
    });
  }

  /**
   * @description shutdown AppService gracefully
   */
  shutdown() {
    return new Promise(async (resolve, reject) => {
      this._running = false;
      this.emit(AppService.SERVICE_SHUTDOWN_EVENT);
      resolve();
    });
  }

  /**
   * @description Load a single App from remote source (delegates to TaskManager for async operation)
   * @argument {String} url URL of App descriptor
   * @argument {String} permission Permission to grant the new App
   * @returns {Promise} Promise which resolves with new App() throws Error()
   */
  loadApp(url, permission) {
    // Use TaskManager to schedule loading the App
    return new Promise(async (resolve, reject) => {
      let task;
      this.logger.info(
        "APP LOAD has been requested, creating a task for it (url=%s, permission=%s)",
        url,
        permission
      );
      try {
        task = await this.taskManager.create(Task.types.APP_LOAD, {
          url: url,
          permission: permission
        });
      } catch (err) {
        this.logger.error("Error creating task %o", err);
        return reject(err);
      }
      // Schedule it immediately
      try {
        task
          .on(Task.events.ERROR_EVENT, error => {
            this.logger.error("App Load failed with error: %o", error);
            reject(error);
          })
          .on(Task.events.SUCCESS_EVENT, data => {
            this.logger.info(
              "App Loaded successfully with App (id=%s, key=%s)",
              data.getId(),
              data.getKey()
            );
            resolve(data);
          })
          .commit();
      } catch (err) {
        this.logger.error("Error could not commit task %o", err);
        return reject(new Error("Error commiting task"));
      }
    });
  }

  /**
   * @description UnLoad an already loaded App (delegates to TaskManager for async operation)
   * @argument {App} app The App to unload
   * @returns {Promise} Promise which resolves when app has been loaded.
   */
  unLoadApp(app) {
    // Use TaskManager to schedule unloading the App
    return new Promise(async (resolve, reject) => {
      let task;
      this.logger.info(
        "APP UNLOAD has been requested, creating a task for it (id=%s)",
        app.getId()
      );
      try {
        task = await this.taskManager.create(Task.types.APP_UNLOAD, {
          app: app
        });
      } catch (err) {
        this.logger.error("Error creating task %o", err);
        return reject(err);
      }
      // Schedule it immediately
      try {
        task
          .on(Task.events.ERROR_EVENT, error => {
            this.logger.error("App UnLoad failed with error: %o", error);
            reject(error);
          })
          .on(Task.events.SUCCESS_EVENT, data => {
            this.logger.info(
              "App UnLoaded successfully (id=%s, key=%s)",
              data.getId(),
              data.getKey()
            );
            resolve(data);
          })
          .commit();
      } catch (err) {
        this.logger.error("Error could not commit task %o", err);
        return reject(new Error("Error commiting task"));
      }
    });
  }

  /**
   * @description Enable an already loaded App (delegates to TaskManager for async operation)
   * @argument {App} app The App to enable
   * @returns {Promise} promise which resolves when app has been enabled
   */
  enableApp(app) {
    // Resolve immediately if App is enabled
    if (app.isEnabled()) {
      return Promise.resolve(app);
    }
    // Use TaskManager to schedule enabling the App
    return new Promise(async (resolve, reject) => {
      let task;
      try {
        task = await this.taskManager.create(Task.types.APP_ENABLE, {
          app: app
        });
      } catch (err) {
        this.logger.error("Error creating task %o", err);
        return reject(err);
      }
      // Schedule it immediately
      try {
        task
          .on(Task.events.ERROR_EVENT, error => {
            reject(error);
          })
          .on(Task.events.SUCCESS_EVENT, data => {
            resolve(data);
          })
          .commit();
      } catch (err) {
        this.logger.error("Error could not commit task %o", err);
        return reject(new Error("Error commiting task"));
      }
    });
  }

  /**
   * @description Disable an already loaded/enabled App (delegates to TaskManager for async operation)
   * @argument {App} app The App to disable
   * @returns {Promise} Promise which resolves when app has been disabled.
   */
  disableApp(app) {
    // Resolve immediately if App is enabled
    if (!app.isEnabled()) {
      return Promise.resolve(app);
    }
    // Use TaskManager to schedule enabling the App
    return new Promise(async (resolve, reject) => {
      let task;
      try {
        task = await this.taskManager.create(Task.types.APP_DISABLE, {
          app: app
        });
      } catch (err) {
        this.logger.error("Error creating task %o", err);
        return reject(err);
      }
      // Schedule it immediately
      try {
        task
          .on(Task.events.ERROR_EVENT, error => {
            reject(error);
          })
          .on(Task.events.SUCCESS_EVENT, data => {
            resolve(data);
          })
          .commit();
      } catch (err) {
        this.logger.error("Error could not commit task %o", err);
        return reject(new Error("Error commiting task"));
      }
    });
  }

  /**
   * @description Get all Apps that match the predicate
   * @argument {Function} predicate : filter the list of Apps using this test
   * @returns {Array} Array of Apps matching predicate
   */
  async getApps(predicate) {
    // Search Store for all known Apps
    return new Promise((resolve, reject) => {
      let raw = [],
        apps = [],
        filtered = [];
      try {
        raw = this.store.find(doc => doc.docType === App.DOCTYPE);
        if (predicate && typeof predicate === "function") {
          filtered = raw.filter(predicate);
          filtered.forEach(app => {
            apps.push(new App(app));
          });
        } else {
          apps = raw;
        }
        resolve(apps);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @description Get a single known App
   * @argument {Object} id The ID of the App
   * @returns {App} Requested App
   */
  async getApp(id) {
    return new Promise((resolve, reject) => {
      let doc, app;
      try {
        // Find the app in the store
        doc = this.store.read(id);
        if (!doc)
          throw new Error("App (id=" + id + ") doesnt exist in the store");

        // Hydrate the module data from their individual stored instances as that is the information which
        // is updated on a per module basis etc.
        if (doc.modules && doc.modules.length) {
          doc.modules = doc.modules.map((cur, idx, arr) => {
            return this.store.read(cur.id);
          });
        }

        // Return a new Instance of App from the data
        app = new App(doc);

        resolve(app);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @description Return array of modules matching a filter object
   * @argument {Function} predicate Function returning truthy value to test  objects in the store against
   * @returns {Array} Array of Modules matching filter
   */
  getModules(predicate) {
    // Search Store for all known Apps
    return new Promise((resolve, reject) => {
      let raw = [],
        modules = [];
      try {
        raw = this.store.find(doc => doc.docType === Module.DOCTYPE);
        raw.forEach(module => {
          modules.push(ModuleFactory.create({ module }));
        });
        if (predicate && typeof predicate === "function") {
          modules = modules.filter(predicate);
        }
        resolve(modules);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @description Return a single App(s) module(s)
   * @argument {String} id The unique id of the Module
   * @returns {Module} Requested Module
   */
  getModule(id) {
    return new Promise((resolve, reject) => {
      let json, module;
      try {
        json = this.store.read(id);
        if (!json) throw new Error("Module (id=" + id + ") doesnt exist");
        module = ModuleFactory.create({ module: json });
        resolve(module);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @description Enable an already loaded Module by an App UUID and module Key
   * @argument {Module} module
   * @returns {Promise} Promise which resolves when module has been enabled.
   */
  enableModule(module) {
    // Resolve immediately if App is enabled
    if (module.isEnabled()) {
      return Promise.resolve(module);
    }
    // Use TaskManager to schedule enabling the App
    return new Promise(async (resolve, reject) => {
      let task;
      try {
        task = await this.taskManager.create(Task.types.MODULE_ENABLE, {
          module: module
        });
      } catch (err) {
        this.logger.error("Error creating task %o", err);
        return reject(err);
      }
      // Schedule it immediately
      try {
        task
          .on(Task.events.ERROR_EVENT, error => {
            reject(error);
          })
          .on(Task.events.SUCCESS_EVENT, data => {
            resolve(data);
          })
          .commit();
      } catch (err) {
        this.logger.error("Error could not commit task %o", err);
        return reject(new Error("Error commiting task"));
      }
    });
  }

  /**
   * @description Disable an already enabled Module by an App UUID and module Key
   * @argument {Module} module
   * @returns {Promise} Promise which resolves when module has been disabled.
   */
  disableModule(module) {
    // Resolve immediately if App is enabled
    if (!module.isEnabled()) {
      return Promise.resolve(module);
    }
    // Use TaskManager to schedule enabling the App
    return new Promise(async (resolve, reject) => {
      let task;
      try {
        task = await this.taskManager.create(Task.types.MODULE_DISABLE, {
          module: module
        });
      } catch (err) {
        this.logger.error("Error creating task %o", err);
        return reject(err);
      }

      // Schedule it immediately
      try {
        task
          .on(Task.events.ERROR_EVENT, error => {
            reject(error);
          })
          .on(Task.events.SUCCESS_EVENT, data => {
            resolve(data);
          })
          .commit();
      } catch (err) {
        this.logger.error("Error could not commit task %o", err);
        return reject(new Error("Error commiting task"));
      }
    });
  }
}

module.exports = SimpleAppService;
