const { AppServiceValidationError } = require("../../constants/errors");
const { validateShapes } = require("../../util/validate");

/**
 * @description Orchestrates
 *                loading Apps via AppLoaders,
 *                triggering events in the EventService based on the LifecycleEventsStrategy and
 *                state persistence via the AppStore
 */
class AppService {
  /**
   * @param {Array} appLoaders - Array of {AppLoader} to use for loading {App}s
   * @param {AppStore} appStore - The AppStore to use for framework persistence
   * @param {LifecycleEventsStrategy} lifecycleEventsStrategy - This is used to customise framework events
   * @param {EventService} eventService - The EventService to use for framework events
   */
  constructor(appLoaders, appStore, lifecycleEventsStrategy, eventService) {
    var lifecycleEventsStrategyInst = lifecycleEventsStrategy;

    try {
      // if lifecycleEventStrategy is a function then create the instance now
      if (typeof lifecycleEventsStrategyInst === "function") {
        lifecycleEventsStrategyInst = new lifecycleEventsStrategyInst(
          this,
          eventService,
          AppStore
        );
      }

      // Validate our args using ducktyping utils. (figure out better way to do this later)
      validateShapes([
        { shape: "AppLoader", object: appLoaders[0] },
        { shape: "AppStore", object: appStore },
        {
          shape: "LifecycleEventsStrategy",
          object: lifecycleEventsStrategyInst
        },
        { shape: "EventService", object: eventService }
      ]);
    } catch (e) {
      throw new AppServiceValidationError(e);
    }

    this.appLoaders = appLoaders;
    this.appStore = appStore;
    this.eventService = eventService;
    this.lifecycleEventsStrategy = lifecycleEventsStrategyInst;
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
}

module.exports = AppService;
