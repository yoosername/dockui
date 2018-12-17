const AppLoader = require("./AppLoader");

/**
 * @class LocalFolderAppLoader
 * @description Load Apps from App descriptors detected on the filepath
 * @argument {Array} AppModuleLoaders - The loaders to use for loading Modules.
 * @argument {EventService} eventService - The Event service.
 */
class LocalFolderAppLoader extends AppLoader{

  constructor(
    appModuleLoaders,
    eventService
  ){
    super(appModuleLoaders, eventService);
  }

  /**
   * @method scanForNewApps
   * @description Starting checking some location for new Apps 
   *              and attempt to load them when found
   *              Loading them involves fetching AppDescriptor
   *              and creating a new App passing it in. The App will
   *              attempt to Load its own Modules and use Events for lifecycle.
   */
  scanForNewApps(){
    // Look in some location
    // When App detected
    // Try to load its descriptor
    // If successfully loaded try to create a App using the descriptor
  }

  /**
   * @method stopScanningForNewApps
   * @description Stop checking for new Apps until scan is called again.
   */
  stopScanningForNewApps(){
    // Implement this
  }

}

module.exports = LocalFolderAppLoader;