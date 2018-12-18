const  {
  APP_SERVICE_STARTING_EVENT,
  APP_SERVICE_STARTED_EVENT,
  APP_SERVICE_SHUTTING_DOWN_EVENT,
  APP_SERVICE_SHUTDOWN_EVENT,
  APP_ENABLED_EVENT,
  APP_DISABLED_EVENT,
  MODULE_ENABLED_EVENT,
  MODULE_DISABLED_EVENT
} = require("../../constants/events");

const  {
  AppServiceValidationError
} = require("../../constants/errors");

const  {
  validateShapes
} = require("../../util/validate");

/**
 * @class AppService
 * @description Use App loaders to detect and load Apps and
 *              a LifecycleStrategy to enable and disable Apps based on custom rules
 */
class AppService{

  constructor(
    appLoaders,
    appStore,
    lifecycleEventsStrategy,
    eventService
  ){
    
    this._running = false;
    var lifecycleEventsStrategyInst = lifecycleEventsStrategy;

    try{

      // if lifecycleEventStrategy is a function then create the instance now
      if(typeof lifecycleEventsStrategyInst==="function"){
        lifecycleEventsStrategyInst = new lifecycleEventsStrategyInst(this, eventService, AppStore);
      }

      // Validate our args using ducktyping utils. (figure out better way to do this later)
      validateShapes([
        {"shape":"AppLoader","object":appLoaders[0]}, 
        {"shape":"AppStore","object":appStore}, 
        {"shape":"LifecycleEventsStrategy","object":lifecycleEventsStrategyInst}, 
        {"shape":"EventService","object":eventService}
      ]);

    }catch(e){
      throw new AppServiceValidationError(e);
    }

    this.appLoaders = appLoaders;
    this.appStore = appStore;
    this.eventService = eventService;
    this.lifecycleEventsStrategy = lifecycleEventsStrategyInst;
    
  }

  /**
   * @method start
   * @description initialize App service
   * @public
   */
  start(){
    "use strict";

    // If we are not already started
    if( this._running !== true ){


      // Notify listeners that we are starting up
      this.eventService.emit(APP_SERVICE_STARTING_EVENT);

      // setup AppEventLifecycleStrategy to handle events
      this.lifecycleEventsStrategy.setup();

      // Kick off scanning for new Apps
      this.scanForNewApps();

      // Flag that we are now running
      this._running = true; 

      // Notify listeners that we have started
      this.eventService.emit(APP_SERVICE_STARTED_EVENT);

    }

  }

  /**
   * @method shutdown
   * @description shutdown App service gracefully
   * @public
   */
  shutdown(){
    "use strict";

    // If we are not already shutdown
    if( this._running === true ){

      // Notify listeners that we are shutting down
      this.eventService.emit(APP_SERVICE_SHUTTING_DOWN_EVENT);

      // Tell Loaders to stop loading Apps
      this.stopScanningForNewApps();

      // Teardown event handlers
      this.lifecycleEventsStrategy.teardown();

      // Flag that we are not running
      this._running = false;

      // Notify listeners that we have shutdown successfully
      this.eventService.emit(APP_SERVICE_SHUTDOWN_EVENT);

    }
  }

  /**
   * scanForNewApps
   * @description Process new Apps using the App Loaders
   * @public
   */
  scanForNewApps(){
    "use strict";
    this.appLoaders.forEach(appLoader => {
        appLoader.scanForNewApps();
    });
  }

  /**
   * stopScanningForNewApps
   * @description Tell Loaders we dont want any more scanning until called again
   * @public
   */
  stopScanningForNewApps(){
    "use strict";
    this.appLoaders.forEach(appLoader => {
        appLoader.stopScanningForNewApps();
    });
  }

  /**
   * getApps
   * @description Get all Apps from all Loaders
   * @argument {Function} filter : filter the list of Apps using this test
   * @public
   */
  getApps(filter){
    "use strict";
    var allApps = [];
    this.appLoaders.forEach(appLoader => {
        allApps.push(appLoader.getApps(filter));
    });
    return allApps;
  }

  /**
   * getApp
   * @description Get single App by key
   * @argument {int} appKey
   * @public
   */
  getApp(appKey){
    "use strict";
    var App = null;
    try{
      App = this.getApps(App => App.getKey() === appKey)[0];
    }catch(e){
      console.warn("[AppService] Attempted to locate App ("+appKey+") but it was not found");
    }
    return App;
  }

  /**
   * enableApp
   * @description Enable a single App
   * @argument {int} appKey
   * @public
   */
  enableApp(appKey){
    "use strict";
    var app = this.getApp(appKey);
    if( app !== null){
      this.appStore.enableApp(appKey);
      this.eventService.emit(APP_ENABLED_EVENT, {
        "App" : app
      });
    }else{
      console.warn("[AppService] Attempted to enable App ("+appKey+") but it was not found - skipping");
    }
  }

  /**
   * disableApp
   * @description Disable a single App
   * @argument {int} appKey
   * @public
   */
  disableApp(appKey){
    "use strict";
    var app = this.getApp(appKey);
    if( app !== null){
      this.appStore.disableApp(appKey);
      this.eventService.emit(APP_DISABLED_EVENT, {
        "App" : app
      });
    }else{
      console.warn("[AppService] Attempted to disable App ("+appKey+") but it was not found - skipping");
    }
  }

  /**
   * getModules(AppKey)
   * @description Return a single App(s) module(s)
   * @argument {int} appKey
   * @argument {Function} filter
   * @public
   */
  getModules(appKey, filter){
    "use strict";
    var modules = [];
    var app = this.getApp(appKey);
    if( app !== null){
      modules = app.getModules();
      if(filter && typeof filter === "function"){
        modules = modules.filter(filter);
      }
    }else{
      console.warn("[AppService] Attempted to get modules for App ("+appKey+") but it was not found - skipping");
    }
    return modules;
  }

    /**
   * getModules(appKey)
   * @description Return a single App(s) module(s)
   * @argument {int} appKey
   * @argument {int} moduleKey
   * @public
   */
  getModule(appKey, moduleKey){
    "use strict";
    var module = null;
    try{
      module = this.getModules(appKey, module => {
        return (module.getKey() === moduleKey);
      })[0];
    }catch(e){
      console.warn("[AppService] Attempted to locate module ("+moduleKey+") for App ("+appKey+") but it was not found");
    }
    return module;
  }

  /**
   * enableModule
   * @description Enable a single App(s) module
   * @argument {int} appKey
   * @argument {int} moduleKey
   * @public
   */
  enableModule(appKey, moduleKey){
    "use strict";
    var module = this.getModule(appKey, moduleKey);
    if( module !== null){
      this.appStore.enableModule(appKey,moduleKey);
      this.eventService.emit(MODULE_ENABLED_EVENT, {
        "module" : module
      });
    }else{
      console.warn("[AppService] Attempted to enable module ("+moduleKey+") for App ("+appKey+") but it was not found - skipping");
    }
  }

  /**
   * disableModule
   * @description Disable a single App(s) module
   * @argument {int} appKey
   * @argument {int} moduleKey
   * @public
   */
  disableModule(appKey, moduleKey){
    "use strict";
    var module = this.getModule(appKey, moduleKey);
    if( module !== null){
      this.appStore.disableModule(appKey,moduleKey);
      this.eventService.emit(MODULE_DISABLED_EVENT, {
        "module" : module
      });
    }else{
      console.warn("[AppService] Attempted to disable module ("+moduleKey+") for App ("+appKey+") but it was not found - skipping");
    }
  }

}

module.exports = AppService;