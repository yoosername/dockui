const AppLoader = require("../AppLoader");

/**
 * @description Listen to framework events for GIT_REPO_REQUESTED events.
 *              - when detected attempt to clone the repo to a temporary cache
 *              - and Request a File based App load Request
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
   * @description Listen to framework events for GIT_REPO_REQUESTED events.
 *              - when detected attempt to clone the repo to a temporary cache
 *              - and Request a File based App load Request
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