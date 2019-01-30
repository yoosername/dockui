const AppLoader = require("../AppLoader");

/**
 * @description Listen to framework events for FILE_APP_LOAD_REQUESTED events.
 *              - when detected attempt to load descriptor from the associated path
 *              - and create an App from the descriptor
 */
class FileAppLoader extends AppLoader{

  /**
   * @argument {AppStore} appStore - The store to use for persistence.
   * @argument {Array} AppModuleLoaders - The loaders to use for loading Modules.
   * @argument {EventService} eventService - The Event service.
   */
  constructor(
    appStore,
    appModuleLoaders,
    eventService
  ){
    super(appStore,appModuleLoaders, eventService);
  }

  /**
   * @description Listen to framework events for FILE_APP_LOAD_REQUESTED events.
   *              when detected:
   *              - Send APP_LOAD_STARTED Event
   *              - Attempt to load descriptor from the path
   *              - Create an App from the descriptor
   *                  - If fail send APP_LOAD_FAILED event
   *              - Add the App to our Cache.
   *              - Send APP_LOAD_COMPLETE Event
   */
  scanForNewApps(){
    // to add Apps to cache use this.addApp(app);
    // to remove Apps from cache use this.removeApp(app);
  }

  /**
   * @description Stop checking for new Apps until scan is called again.
   */
  stopScanningForNewApps(){
    
  }

}

module.exports = FileAppLoader;