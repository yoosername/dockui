const {
  APP_SERVICE_STARTING_EVENT,
  APP_SERVICE_STARTED_EVENT,
  APP_SERVICE_SHUTTING_DOWN_EVENT,
  APP_SERVICE_SHUTDOWN_EVENT,
  APP_ENABLED_EVENT,
  APP_DISABLED_EVENT,
  MODULE_ENABLED_EVENT,
  MODULE_DISABLED_EVENT
} = require("../../constants/events");

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
    this._running = false;
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

    // If we are not already started
    if (this._running !== true) {
      // Notify listeners that we are starting up
      this.eventService.emit(APP_SERVICE_STARTING_EVENT);

      // setup AppEventLifecycleStrategy to handle events
      this.lifecycleEventsStrategy.setup();

      // Kick off scanning for new Apps
      this.scanForNewApps();

      // Flag that we are now running
      this._running = true;

      // Notify listeners that we have started
      this.eventService.emit(APP_SERVICE_STARTED_EVENT);
    }
  }

  /**
   * @description shutdown AppService gracefully
   */
  shutdown() {
    "use strict";

    // If we are not already shutdown
    if (this._running === true) {
      // Notify listeners that we are shutting down
      this.eventService.emit(APP_SERVICE_SHUTTING_DOWN_EVENT);

      // Tell Loaders to stop loading Apps
      this.stopScanningForNewApps();

      // Teardown event handlers
      this.lifecycleEventsStrategy.teardown();

      // Flag that we are not running
      this._running = false;

      // Notify listeners that we have shutdown successfully
      this.eventService.emit(APP_SERVICE_SHUTDOWN_EVENT);
    }
  }

  /**
   * @description Tell each AppLoader to start looking for new Apps
   */
  scanForNewApps() {
    "use strict";
    this.appLoaders.forEach(appLoader => {
      appLoader.scanForNewApps();
    });
  }

  /**
   * @description Tell each AppLoader we dont want any more scanning until called again
   */
  stopScanningForNewApps() {
    "use strict";
    this.appLoaders.forEach(appLoader => {
      appLoader.stopScanningForNewApps();
    });
  }

  /**
   * @description Get all Apps from all Loaders
   * @argument {Function} filter : filter the list of Apps using this test
   */
  getApps(filter) {
    "use strict";
    var allApps = [];
    this.appLoaders.forEach(appLoader => {
      allApps.push(appLoader.getApps(filter));
    });
    return allApps;
  }

  /**
   * @description Get single App by key
   * @argument {int} appKey
   */
  getApp(appKey) {
    "use strict";
    var App = null;
    try {
      App = this.getApps(App => App.getKey() === appKey)[0];
    } catch (e) {
      console.warn(
        "[AppService] Attempted to locate App (" +
          appKey +
          ") but it was not found"
      );
    }
    return App;
  }

  /**
   * @description Return a single App(s) module(s)
   * @argument {int} appKey
   * @argument {Function} filter
   */
  getModules(appKey, filter) {
    "use strict";
    var modules = [];
    var app = this.getApp(appKey);
    if (app !== null) {
      modules = app.getModules();
      if (filter && typeof filter === "function") {
        modules = modules.filter(filter);
      }
    } else {
      console.warn(
        "[AppService] Attempted to get modules for App (" +
          appKey +
          ") but it was not found - skipping"
      );
    }
    return modules;
  }

  /**
   * @description Return a single App(s) module(s)
   * @argument {int} appKey
   * @argument {int} moduleKey
   */
  getModule(appKey, moduleKey) {
    "use strict";
    var module = null;
    try {
      module = this.getModules(appKey, module => {
        return module.getKey() === moduleKey;
      })[0];
    } catch (e) {
      console.warn(
        "[AppService] Attempted to locate module (" +
          moduleKey +
          ") for App (" +
          appKey +
          ") but it was not found"
      );
    }
    return module;
  }
}

module.exports = AppService;
