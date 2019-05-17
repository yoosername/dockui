const AppService = require("../AppService");
const Task = require("../../../task/Task");

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
   */
  constructor(taskManager, store, config) {
    super(taskManager, store, config);
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
      await this.taskManager.start();
      this._running = true;
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
   * @description Load a single App from remote source
   * @argument {String} url URL of App descriptor
   * @argument {String} permission Permission to grant the new App
   * @returns {Promise} Promise which resolves with new App() throws Error()
   */
  loadApp(url, permission) {
    // Use TaskManager to schedule loading the App
    return new Promise(async (resolve, reject) => {
      const task = await this.taskManager.create(Task.types.APP_LOAD, {
        url: url,
        permission: permission
      });
      // Schedule it immediately
      task
        .on("error", error => {
          reject(error);
        })
        .on("success", data => {
          resolve(data);
        })
        .commit();
    });
  }

  /**
   * @description UnLoad an already loaded App
   * @argument {App} app The App to unload
   * @returns {Promise} Promise which resolves when app has been loaded.
   */
  unLoadApp(app) {
    // Use TaskManager to schedule unloading the App
    return new Promise(async (resolve, reject) => {
      const task = await this.taskManager.create(Task.types.APP_UNLOAD, app);
      // Schedule it immediately
      task
        .on("error", error => {
          reject(error);
        })
        .on("success", data => {
          resolve(data);
        })
        .commit();
    });
  }

  /**
   * @description Enable an already loaded App
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
      const task = await this.taskManager.create(Task.types.APP_ENABLE, app);
      // Schedule it immediately
      task
        .on("error", error => {
          reject(error);
        })
        .on("success", data => {
          resolve(data);
        })
        .commit();
    });
  }

  /**
   * @description Disable an already loaded/enabled App
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
      const task = await this.taskManager.create(Task.types.APP_DISABLE, app);
      // Schedule it immediately
      task
        .on("error", error => {
          reject(error);
        })
        .on("success", data => {
          resolve(data);
        })
        .commit();
    });
  }

  /**
   * @description Get all Apps that match the filter
   * @argument {Function} filter : filter the list of Apps using this test
   * @returns {Array} Array of Apps matching filter
   */
  getApps(filter) {
    // Search Store for all known Apps
    return new Promise(async (resolve, reject) => {
      let apps = [];
      try {
        apps = await this.store.find(filter);
        resolve(apps);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @description Get a single known App
   * @argument {Object} partial Partial Object representing the App
   * @returns {App} Requested App
   */
  getApp(partial) {
    // Lookup App in Store using partial info
    // If it exists, return new App()
  }

  /**
   * @description Return array of modules matching a filter object
   * @argument {Function} filter
   * @returns {Array} Array of Modules matching filter
   */
  getModules(filter) {
    //Search the store for all modules
    // Filter the ones matching the filter
    // Foreach one return array of new Module objects
    // Or if none empty array
  }

  /**
   * @description Return a single App(s) module(s)
   * @argument {object} partial
   * @returns {Module} Requested Module
   */
  getModule(partial) {
    // Lookup App in Store using partial module info
    // If it exists, return new Module()
  }

  /**
   * @description Enable an already loaded Module by an App UUID and module Key
   * @argument {Module} module
   * @returns {Promise} Promise which resolves when module has been enabled.
   */
  enableModule(module) {
    // if(module.isEnabled()){
    //   return Promise.resolve(module);
    // }
    // Use TaskManager to schedule enabling the Module
    // const task = TaskManager.createTask("MODULE_ENABLE", {module});
    //
    // Return a promise which resolves once task is complete
    // return new Promise((resolve,reject)={
    //   task
    //     .on("error", (error)=>{
    //       reject(error);
    //     })
    //     .on("success", (result)=>{
    //       // Return the original app for chaining
    //       resolve(module);
    //     })
    //     .commit();
    // });
    //
  }

  /**
   * @description Disable an already enabled Module by an App UUID and module Key
   * @argument {Module} module
   * @returns {Promise} Promise which resolves when module has been disabled.
   */
  disableModule(module) {
    // if(!module.isEnabled()){
    //   return Promise.resolve(module);
    // }
    // Use TaskManager to schedule enabling the Module
    // const task = TaskManager.createTask("MODULE_DISABLE", {module});
    //
    // Return a promise which resolves once task is complete
    // return new Promise((resolve,reject)={
    //   task
    //     .on("error", (error)=>{
    //       reject(error);
    //     })
    //     .on("success", (result)=>{
    //       // Return the original app for chaining
    //       resolve(module);
    //     })
    //     .commit();
    // });
    //
  }
}

module.exports = SimpleAppService;
