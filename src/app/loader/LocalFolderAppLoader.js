const  {
  validateShapes
} = require("../../util/validate");


/**
 * @class LocalFolderAppLoader
 * @description Load Apps from App descriptors detected on the filepath
 * @argument {Array} AppModuleLoaders - The loaders to use for loading Modules.
 * @argument {EventService} eventService - The Event service.
 */
class LocalFolderAppLoader{

  constructor(
    appModuleLoaders,
    eventService
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"AppModuleLoader","object":appModuleLoaders[0]},
      {"shape":"EventService","object":eventService}
    ]);

    this.appModuleLoaders = appModuleLoaders;
    this.eventsService = eventService;

    this.loadedApps = [];
    this.loadFailedApps = [];

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

  /**
   * @method getApps
   * @description Return all loaded Apps.
   */
  getApps(){
    // Implement this
  }

  /**
   * @method enableApp
   * @description Hook to do any tasks relating to enabling the App
   *              e.g. notify the remote webservice that it has been enabled
   */
  enableApp(){
    // Implement this
  }

  /**
   * @method disableApp
   * @description Hook to do any tasks relating to disabling the App
   *              e.g. notify the remote webservice that it has been disabled
   */
  disableApp(){
    // Implement this
  }

  /**
   * @method getAppModules
   * @argument app The App whos modules we want to fetch
   * @argument filter (optional) The Filter to limit modules found
   * @description get an array of modules from the specified App
   */
  getAppModules(app, filter){
    // Implement this
  }

 /**
   * @method enableAppModule
   * @argument module The AppModule which was enabled
   * @description Hook called when the given Module is enabled by the system.
   */
  enableAppModule(AppModule){
    // Implement this
  }

   /**
   * @method disableAppModule
   * @argument module The AppModule which was disabled
   * @description Hook called when the given Module is disabled by the system.
   */
  disableAppModule(AppModule){
    // Implement this
  }

}

module.exports = LocalFolderAppLoader;