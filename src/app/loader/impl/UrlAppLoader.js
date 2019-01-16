const AppLoader = require("../AppLoader");

/**
 * @class UrlAppLoader
 * @description Listen to framework events for APP_LOAD_REQUESTED events.
 *              - when detected attempt to load descriptor from the URL
 *              - and create an App from the descriptor
 * @argument {AppStore} appStore - The store to use for persistence.
 * @argument {Array} AppModuleLoaders - The loaders to use for loading Modules.
 * @argument {EventService} eventService - The Event service.
 */
class UrlAppLoader extends AppLoader{

  constructor(
    appStore,
    appModuleLoaders,
    eventService
  ){
    super(appStore,appModuleLoaders, eventService);
  }

  /**
   * @method scanForNewApps
   * @description Listen to framework events for APP_LOAD_REQUESTED events.
   *              when detected:
   *              - Send APP_LOAD_STARTED Event
   *              - Attempt to load descriptor from the URL
   *              - Create an App from the descriptor
   *                  - If fail send App load failed event
   *              - Add the App to our Cache.
   *              - Send APP_LOAD_COMPLETE Event
   *              Listen to framework events for APP_UNLOAD_REQUESTED events
   *              when detected:
   *              - disable all the Apps modules
   *              - Remove associated App from cache
   */
  scanForNewApps(){
    // TODO: Implement me
    // to add use this.addApp(app);
    // to remove use this.removeApp(app);
  }

  /**
   * @method stopScanningForNewApps
   * @description Stop checking for new Apps until scan is called again.
   */
  stopScanningForNewApps(){
    // TODO: Implement me
  }

}

module.exports = UrlAppLoader;