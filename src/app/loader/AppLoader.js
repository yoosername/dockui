const  {
  validateShapes
} = require("../../util/validate");
  
  
  /**
   * @class AppLoader
   * @description Load Apps from App descriptors detected in some manner
   *              The detection is left down to subclasses.
   * @argument {AppStore} appStore - The store to use for persistence.
   * @argument {Array} moduleLoaders - The loaders to use for loading Modules.
   * @argument {EventService} eventService - The Event service.
   */
  class AppLoader{
  
    constructor(
      appStore,
      moduleLoaders,
      eventService
    ){
      
      // Validate our args using ducktyping utils. (figure out better way to do this later)
      validateShapes([
        {"shape":"AppStore","object":appStore},
        {"shape":"ModuleLoader","object":moduleLoaders[0]},
        {"shape":"EventService","object":eventService}
      ]);
  
      this.appStore = appStore;
      this.moduleLoaders = moduleLoaders;
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
      // This should be implemented by subclasses.
    }

    /**
     * @method stopScanningForNewApps
     * @description Stop checking for new Apps until scan is called again.
     */
    stopScanningForNewApps(){
      // This should be implemented by subclasses.
    }

    /**
     * @method addApp
     * @description Add a single App to the cache
     */
    addApp(app){
      this.loadedApps.push(app);
    }

    /**
     * @method removeApp
     * @description Remove a single App from the cache
     */
    removeApp(app){
      this.loadedApps = this.loadedApps.filter(function(appItem){
        return appItem !== app;
      });
    }

    /**
     * @method getApps
     * @argument {Function} filter - function to filter the list of Apps with
     * @description Return all loaded Apps.
     */
    getApps(filter){
      if(filter && typeof filter === "function"){
        return this.loadedApps.filter(filter);
      }
      return this.loadedApps;
    }

    /**
     * @method getApp
     * @description Return single App by its Key
     */
    getApp(key){
      return this.getApps(app=>app.getKey()===key);
    }
  
  }
  
  module.exports = AppLoader;