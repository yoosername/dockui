const  {
  validateShapes
} = require("../../util/validate");
  
  
  /**
   * @class AppLoader
   * @description Load Apps from App descriptors detected in some manner
   *              The detection is left down to subclasses.
   * @argument {Array} appModuleLoaders - The loaders to use for loading Modules.
   * @argument {EventService} eventService - The Event service.
   */
  class AppLoader{
  
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