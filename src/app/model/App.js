const  {
  APP_MODULE_LOAD_STARTED_EVENT,
  APP_MODULE_LOAD_COMPLETE_EVENT,
  APP_MODULE_LOAD_FAILED_EVENT
} = require("../../constants/events");

const  {
  validateShapes
} = require("../../util/validate");


/**
 * @class App
 * @description Represents a single App.
 * @argument {AppLoader} appLoader - The loader which loaded us.
 * @argument {string} appKey - The unique key.
 * @argument {Array} appModules - The Apps loaded modules.
 * @argument {EventService} eventService - The Event service.
 */
class App{

  constructor(
    appKey,
    appDescriptor,
    appLoader, 
    appModuleLoaders,
    eventService
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"AppLoader","object":appLoader},
      {"shape":"AppModuleLoader","object":appModuleLoaders[0]},
      {"shape":"AppDescriptor","object":appDescriptor},
      {"shape":"EventService","object":eventService}
    ]);

    this.AppLoader = appLoader; 
    this.AppKey = appKey; 
    this.AppDescriptor = appDescriptor;
    this.AppModuleLoaders = appModuleLoaders;
    this.eventsService = eventService;

    this.modules = [];
    this.registerAppModules();

  }

  /**
   * @method getKey
   * @description return the unique key of this App
   */
  getKey(){
    return this.appKey;
  }

  /**
   * @method getAppLoader
   * @description return the loader which loaded this App
   */
  getAppLoader(){
    return this.appLoader;
  }

  /**
   * @method getAppDescriptor
   * @description return the App Descriptor this App was parsed from
   */
  getAppDescriptor(){
    return this.appDescriptor;
  }

  /**
   * @method getEventService
   * @description return event service
   */
  getEventService(){
    return this.eventService;
  }

  /**
   * @method getAppModuleLoaders
   * @description return AppModule loaders which are available for parsing Module Descriptors
   */
  getAppModuleLoaders(){
    return this.appModuleLoaders;
  }

  /**
   * @method getAppModules
   * @description return all loaded AppModules for this App
   */
  getAppModules(filter){
    return [].concat.apply([], this.getAppModules().map(
        loader=>loader.getModules(filter)
      )
    );
  }

  /**
   * @method enable
   * @description delegate enabling and disabling to our loader
   */
  enable(){
    this.appLoader.enableApp(this);
  }

  /**
   * @method disable
   * @description delegate enabling and disabling to our loader
   */
  disable(){
    this.appLoader.disableApp(this);
  }

  /**
   * @method registerAppModules
   * @description Try to parse the AppDescriptor and load 
   * all the modules in it using any of the passed in ModuleLoaders
   * Unloadable modules are created anyway but automatically disabled
   */
  registerAppModules(){

    this.appDescriptor.modules.forEach(moduleDescriptor =>{
      var module = null;
      var loaded = false;

      this.eventService.trigger(APP_MODULE_LOAD_STARTED_EVENT, {
        "app" : this,
        "descriptor" : moduleDescriptor
      });

      this.appModuleLoaders.forEach(moduleLoader =>{
        try{
          if(moduleLoader.canLoadModuleDescriptor(moduleDescriptor) && !loaded){
            module = moduleLoader.loadModuleFromDescriptor(moduleDescriptor);
            loaded = true;
          }
        }catch(e){
          // Not bothered
        }
      });
      if(!module){
        // Load an unloadable Module here maybe?
      }
      if(module){
        this.modules.push(module);
        this.eventService.trigger(APP_MODULE_LOAD_COMPLETE_EVENT, {
          "app" : this,
          "descriptor" : moduleDescriptor,
          "module" : module
        });
      }else{
        this.eventService.trigger(APP_MODULE_LOAD_FAILED_EVENT, {
          "app" : this,
          "descriptor" : moduleDescriptor
        });
      }
    });

  }

}

module.exports = App;