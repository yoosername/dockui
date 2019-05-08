const AppService = require("../AppService");

/**
 * @description Orchestrates
 *                loading Apps via AppLoaders,
 *                triggering events in the EventService based on the LifecycleEventsStrategy and
 *                state persistence via the AppStore
 */
class DefaultAppService extends AppService {
  /**
   * @param {DockUIContext} context - Runtime Context object used to find runtime services.
   */
  constructor(context) {
    super(context);
    this._running = false;
  }

  /**
   * @description Initialize and start the AppService
   * @returns {Promise} Promise which resolves once started
   */
  start() {
    // Send local startup event
    // Make sure TaskManager Running
    // Make Sure Store Ready
    // Then Report we are ready
    // Send local started event
  }

  /**
   * @description shutdown AppService gracefully
   */
  shutdown() {
    // Send shuttingdown event
    // Send shutdown event
  }

  /**
   * @description Load a single App from remote source
   * @argument {String} url URL of App descriptor
   * @argument {String} permission Permission to grant the new App
   * @returns {Promise} Promise which resolves with new App() throws Error()
   */
  loadApp(url, permission) {
    // Use TaskManager to schedule loading the App
    // const task = TaskManager.createTask("APP_LOAD", {url, permission});
    //
    // Return a promise which resolves once task is complete
    // return new Promise((resolve,reject)={
    //   task
    //     .setTimeout(10000)
    //     .delayUntil(Date.parse('2020-01-01'))
    //     .on("error", (error)=>{
    //       reject(error);
    //     })
    //     .on("success", (result)=>{
    //       const app = this.getApp(result);
    //       resolve(app);
    //     })
    //     .commit();
    // });
    //
  }

  /**
   * @description UnLoad an already loaded App
   * @argument {App} app The App to unload
   * @returns {Promise} Promise which resolves when app has been loaded.
   */
  unLoadApp(app) {
    // Use TaskManager to schedule unloading the App
    // const task = TaskManager.createTask("APP_UNLOAD", {app});
    //
    // Return a promise which resolves once task is complete
    // return new Promise((resolve,reject)={
    //   task
    //     .on("error", (error)=>{
    //       reject(error);
    //     })
    //     .on("success", (result)=>{
    //       // Return the original app for chaining
    //       resolve(app);
    //     })
    //     .commit();
    // });
    //
  }

  /**
   * @description Enable an already loaded App by its UUID
   * @argument {App} app The App to enable
   * @returns {Promise} promise which resolves when app has been enabled
   */
  enableApp(app) {
    // if(app.isEnabled()){
    //   return Promise.resolve(app);
    // }
    // Use TaskManager to schedule enabling the App
    // const task = TaskManager.createTask("APP_ENABLE", {app});
    //
    // Return a promise which resolves once task is complete
    // return new Promise((resolve,reject)={
    //   task
    //     .on("error", (error)=>{
    //       reject(error);
    //     })
    //     .on("success", (result)=>{
    //       // Return the original app for chaining
    //       resolve(app);
    //     })
    //     .commit();
    // });
    //
  }

  /**
   * @description Disable an already loaded/enabled App by its UUID
   * @argument {String} uuid The App UUID to disable
   * @returns {Promise} Promise which resolves when app has been disabled.
   */
  disableApp(uuid) {
    // if(!app.isEnabled()){
    //   return Promise.resolve(app);
    // }
    // Use TaskManager to schedule disabling the App
    // const task = TaskManager.createTask("APP_DISABLE", {app});
    //
    // Return a promise which resolves once task is complete
    // return new Promise((resolve,reject)={
    //   task
    //     .on("error", (error)=>{
    //       reject(error);
    //     })
    //     .on("success", (result)=>{
    //       // Return the original app for chaining
    //       resolve(app);
    //     })
    //     .commit();
    // });
    //
  }

  /**
   * @description Get all Apps that match the filter
   * @argument {Function} filter : filter the list of Apps using this test
   * @returns {Array} Array of Apps matching filter
   */
  getApps(filter) {
    //Search the store for all apps
    // Filter the ones matching the filter
    // Foreach one return array of new App objects
    // Or if none empty array
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

module.exports = DefaultAppService;
