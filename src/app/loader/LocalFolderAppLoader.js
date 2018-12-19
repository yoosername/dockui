const AppLoader = require("./AppLoader");

/**
 * @class LocalFolderAppLoader
 * @description Load Apps from App descriptors detected on the filepath
 * @argument {AppStore} appStore - The store to use for persistence.
 * @argument {Array} AppModuleLoaders - The loaders to use for loading Modules.
 * @argument {EventService} eventService - The Event service.
 */
class LocalFolderAppLoader extends AppLoader{

  constructor(
    appStore,
    appModuleLoaders,
    eventService
  ){
    super(appStore,appModuleLoaders, eventService);
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
    // Try to load its descriptor and create AppDescriptor
    // Try to create App() using the parsed JSON Descriptor
        // If fail send App load failed event
        // Add the App to our Cache.
        // enable all of this Apps modules.
        // Send App Load Complete Event
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