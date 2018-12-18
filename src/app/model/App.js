const  {
  MODULE_LOAD_STARTED_EVENT,
  MODULE_LOAD_COMPLETE_EVENT,
  MODULE_LOAD_FAILED_EVENT,
  APP_ENABLED_EVENT,
  APP_DISABLED_EVENT
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
    key,
    descriptor,
    loader, 
    moduleLoaders,
    eventService
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"AppLoader","object":loader},
      {"shape":"AppModuleLoader","object":moduleLoaders[0]},
      {"shape":"AppDescriptor","object":descriptor},
      {"shape":"EventService","object":eventService}
    ]);

    this.loader = loader; 
    this.key = key; 
    this.descriptor = descriptor;
    this.moduleLoaders = moduleLoaders;
    this.eventsService = eventService;

    this.modules = [];
    this.loadModules();

    this.enabled = false;

  }

  /**
   * @method getKey
   * @description return the unique key of this App
   */
  getKey(){
    return this.key;
  }

  /**
   * @method getLoader
   * @description return the loader which loaded this App
   */
  getLoader(){
    return this.loader;
  }

  /**
   * @method getDescriptor
   * @description return the App Descriptor this App was parsed from
   */
  getDescriptor(){
    return this.descriptor;
  }

  /**
   * @method getEventService
   * @description return event service
   */
  getEventService(){
    return this.eventService;
  }

  /**
   * @method getModuleLoaders
   * @description return Module loaders which are available for parsing Module Descriptors
   */
  getModuleLoaders(){
    return this.moduleLoaders;
  }

  /**
   * @method enable
   * @description Toggle enabled flag and notify event listeners
   */
  enable(){
    this.enabled = true;
    this.eventService.trigger(APP_ENABLED_EVENT, {
      "app" : this
    });
  }

  /**
   * @method disable
   * @description Toggle enabled flag and notify event listeners
   */
  disable(){
    this.enabled = false;
    this.eventService.trigger(APP_DISABLED_EVENT, {
      "app" : this
    });
  }

  /**
   * @method loadModules
   * @description Try to parse the AppDescriptor.modules and load 
   * all the modules in it using any of the passed in ModuleLoaders
   * Unloadable modules are loaded anyway but automatically disabled
   */
  loadModules(){

    this.appDescriptor.modules.forEach(moduleDescriptor =>{
      var module = null;
      var loaded = false;

      this.eventService.trigger(MODULE_LOAD_STARTED_EVENT, {
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
          // Perhaps create a special auto disabled UnloadableModule with error set
        }
      });
      if(!module){
        // Perhaps create a special auto disabled UnloadableModule with unkown error
      }
      if(module){
        this.modules.push(module);
        this.eventService.trigger(MODULE_LOAD_COMPLETE_EVENT, {
          "app" : this,
          "descriptor" : moduleDescriptor,
          "module" : module
        });
      }else{
        this.eventService.trigger(MODULE_LOAD_FAILED_EVENT, {
          "app" : this,
          "descriptor" : moduleDescriptor
        });
      }
    });

  }

}

module.exports = App;