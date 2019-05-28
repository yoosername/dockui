const EventEmitter = require("events");
const SERVICE_STARTED_EVENT = "appService:started";
const SERVICE_SHUTDOWN_EVENT = "appService:shutdown";
/**
 * @description Service which provides methods to
 *                loading/unLoad Apps/Modules from remote sources,
 *                Finding loaded Apps from DB,
 *                Enabling/Disabling Apps/Modules,
 *
 */
class AppService extends EventEmitter {
  /**
   * @param {TaskManager} taskManager - TaskManager is used to orchestrate changes to the system.
   * @param {AppStore} store - Store is used for loading persisted state.
   * @param {Config} config - The runtime config
   */
  constructor(taskManager, store, config) {
    super();
    this.taskManager = taskManager;
    this.store = store;
    this.config = config;
  }

  /**
   * @description Get the configured taskManager
   */
  getTaskManager() {
    "use strict";
    return this.taskManager;
  }

  /**
   * @description Get the configured AppStore
   */
  getStore() {
    "use strict";
    return this.store;
  }

  /**
   * @description Get the runtime config used by this AppService
   */
  getConfig() {
    "use strict";
    return this.config;
  }

  /**
   * @description Initialize and start the AppService
   */
  start() {
    "use strict";
    console.warn(
      "[AppService] start - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description shutdown AppService gracefully
   */
  shutdown() {
    "use strict";
    console.warn(
      "[AppService] shutdown - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Load a single App from a URL
   * @argument {String} url The remote URL to the App Descriptor
   */
  loadApp(url) {
    "use strict";
    console.warn(
      "[AppService] loadApp - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description UnLoad an already loaded App by its UUID
   * @argument {String} uuid The App UUID to unload
   */
  unLoadApp(uuid) {
    "use strict";
    console.warn(
      "[AppService] unLoadApp - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Enable an already loaded App by its UUID
   * @argument {String} uuid The App UUID to enable
   */
  enableApp(uuid) {
    "use strict";
    console.warn(
      "[AppService] enableApp - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Disable an already loaded/enabled App by its UUID
   * @argument {String} uuid The App UUID to disable
   */
  disableApp(uuid) {
    "use strict";
    console.warn(
      "[AppService] disableApp - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Get all Apps from all Loaders
   * @argument {Function} predicate : filter the list of Apps using a truthy function
   */
  getApps(predicate) {
    "use strict";
    console.warn(
      "[AppService] getApps - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Get single App by key
   * @argument {int} appKey
   */
  getApp(appKey) {
    "use strict";
    console.warn(
      "[AppService] getApp - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Load a single App Module given an App UUID and a Module key
   * @argument {String} uuid The App UUID whos module we wish to load
   * @argument {String} key The Module key we wish to load
   */
  loadModule(uuid, key) {
    "use strict";
    console.warn(
      "[AppService] loadModule - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description UnLoad a single App Module given an App UUID and a Module key
   * @argument {String} uuid The App UUID whos module we wish to unLoad
   * @argument {String} key The Module key we wish to unLoad
   */
  unLoadModule(uuid, key) {
    "use strict";
    console.warn(
      "[AppService] unLoadModule - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Return a single App(s) module(s)
   * @argument {int} appKey
   * @argument {Function} filter
   */
  getModules(appKey, filter) {
    "use strict";
    console.warn(
      "[AppService] getModules - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Return a single App(s) module(s)
   * @argument {int} appKey
   * @argument {int} moduleKey
   */
  getModule(appKey, moduleKey) {
    "use strict";
    console.warn(
      "[AppService] getModule - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Enable an already loaded Module by an App UUID and module Key
   * @argument {int} appKey
   * @argument {int} moduleKey
   */
  enableModule(appKey, moduleKey) {
    "use strict";
    console.warn(
      "[AppService] enableModule - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Disable an already enabled Module by an App UUID and module Key
   * @argument {int} appKey
   * @argument {int} moduleKey
   */
  disableModule(appKey, moduleKey) {
    "use strict";
    console.warn(
      "[AppService] disableModule - NoOp implementation - this should be extended by child classes"
    );
  }
}

AppService.SERVICE_STARTED_EVENT = SERVICE_STARTED_EVENT;
AppService.SERVICE_SHUTDOWN_EVENT = SERVICE_SHUTDOWN_EVENT;

module.exports = AppService;
