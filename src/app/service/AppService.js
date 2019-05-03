/**
 * @description Orchestrates
 *                loading Apps via AppLoaders,
 *                triggering events in the EventService based on the LifecycleEventsStrategy and
 *                state persistence via the AppStore
 */
class AppService {
  /**
   * @param {DockUIContext} context - DockUIContext used to find runtime services.
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * @description Get the runtime DockUIContext for this instance
   */
  getContext() {
    "use strict";
    return this.context;
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
   * @description Tell each AppLoader to start looking for new Apps
   */
  scanForNewApps() {
    "use strict";
    console.warn(
      "[AppService] scanForNewApps - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Tell each AppLoader we dont want any more scanning until called again
   */
  stopScanningForNewApps() {
    "use strict";
    console.warn(
      "[AppService] stopScanningForNewApps - NoOp implementation - this should be extended by child classes"
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
   * @argument {Function} filter : filter the list of Apps using this test
   */
  getApps(filter) {
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

module.exports = AppService;
