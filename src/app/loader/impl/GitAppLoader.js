const AppLoader = require("../AppLoader");

/**
 * @description An AppLoader which detects GIT_REPO_REQUESTED events.
 *              - when detected attempt to clone the repo to a temporary cache
 *              - and send a FILE_APP_LOAD_REQUEST Event
 */
class GitAppLoader extends AppLoader{

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
   * @description Detect GIT_REPO_REQUESTED events.
   *              - when detected attempt to clone the repo to a temporary cache
   *              - and send a FILE_APP_LOAD_REQUEST Event
   */
  scanForNewApps(){
    
  }

  /**
   * @description Stop listening for GIT_REPO_REQUESTED events
   */
  stopScanningForNewApps(){
    
  }

}

module.exports = GitAppLoader;