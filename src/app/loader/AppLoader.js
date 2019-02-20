const { validateShapes } = require("../../util/validate");

/**
 * @description Load Apps from App descriptors detected in some manner
 *              The detection is left down to subclasses.
 */
class AppLoader {
  /**
   * @argument {AppStore} appStore - The store to use for persistence.
   * @argument {Array} moduleLoaders - The loaders to use for loading Modules.
   * @argument {EventService} eventService - The Event service.
   */
  constructor(appStore, moduleLoaders, eventService) {
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      { shape: "AppStore", object: appStore },
      {
        shape: "ModuleLoader",
        object: moduleLoaders ? moduleLoaders[0] : null
      },
      { shape: "EventService", object: eventService }
    ]);

    this.appStore = appStore;
    this.moduleLoaders = moduleLoaders;
    this.eventService = eventService;
    this.loadedApps = [];
    this.loadFailedApps = [];
  }

  /**
   * @description Starting checking some location for new Apps
   *              and attempt to load them when found
   *              Loading them involves fetching AppDescriptor
   *              and creating a new App passing it in. The App will
   *              attempt to Load its own Modules and use Events for lifecycle.
   */
  scanForNewApps() {
    // This should be implemented by subclasses.
  }

  /**
   * @description Stop checking for new Apps until scan is called again.
   */
  stopScanningForNewApps() {
    // This should be implemented by subclasses.
  }

  /**
   * @description Add a single App to the cache
   * @argument {App} app The App to add to the cache
   */
  addApp(app) {
    this.loadedApps.push(app);
  }

  /**
   * @description Remove a single App from the cache
   * @argument {App} app The App to remove
   */
  removeApp(app) {
    this.loadedApps = this.loadedApps.filter(function(appItem) {
      return appItem !== app;
    });
  }

  /**
   * @description Return all loaded Apps.
   * @argument {Function} filter - function to filter the list of Apps with
   * @returns {Array} Array of Apps
   */
  getApps(filter) {
    if (filter && typeof filter === "function") {
      return this.loadedApps.filter(filter);
    }
    return this.loadedApps;
  }

  /**
   * @description Return single App by its Key
   * @argument {String} key Key to filter on
   */
  getApp(key) {
    const apps = this.getApps(app => app.getKey() === key);
    if (apps.length) {
      return apps[0];
    } else {
      return null;
    }
  }
}

module.exports = AppLoader;
