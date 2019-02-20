const AppLoader = require("../AppLoader");

/**
 * @description An AppLoader which detects FILE_APP_LOAD_REQUESTED events then
 *              loads descriptor from the associated local file path then
 *              - If it has a detectable remote loads the App and initializes it
 *              - If it doesnt but it has build instructions then notifies the AppBuilderLoader
 */
class FileAppLoader extends AppLoader {
  /**
   * @argument {AppStore} appStore - The store to use for persistence.
   * @argument {Array} AppModuleLoaders - The loaders to use for loading Modules.
   * @argument {EventService} eventService - The Event service.
   */
  constructor(appStore, appModuleLoaders, eventService) {
    super(appStore, appModuleLoaders, eventService);
  }

  /**
   * @description Listen to framework events for FILE_APP_LOAD_REQUESTED events.
   *              when detected:
   *              - Send FILE_APP_LOAD_STARTED Event
   *              - Attempt to load descriptor from the path
   *                  - If fail send FILE_APP_LOAD_FAILED event
   *              - If it has a detectable remote loads the App and initializes it
   *                - Add the App to our Cache.
   *              - If it doesnt but it has build instructions then
   *                - send APP_BUILD_REQUESTED Event
   *              - Send FILE_APP_LOAD_COMPLETE Event
   */
  scanForNewApps() {
    // to add Apps to cache use this.addApp(app);
    // to remove Apps from cache use this.removeApp(app);
  }

  /**
   * @description Stop checking for new Apps until scan is called again.
   */
  stopScanningForNewApps() {}
}

module.exports = FileAppLoader;
