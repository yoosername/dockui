

const uuidv4 = require('uuid/v4');

const  {
  MODULE_LOAD_STARTED_EVENT,
  MODULE_LOAD_COMPLETE_EVENT,
  MODULE_LOAD_FAILED_EVENT,
  APP_ENABLED_EVENT,
  APP_DISABLED_EVENT
} = require("../constants/events");

const  {
  validateShapes
} = require("../util/validate");

const  {
  AppBootstrapError
} = require("../constants/errors");

const SecurityContext = require("./security/SecurityContext");


/**
 * @class App
 * @description Represents a single App.
 * @argument {string} key - A universally unique key for this App.
 * @argument {string} permission - one of "READ", "WRITE", "ADMIN" (note these are additive)
 * @argument {AppDescriptor} descriptor - The AppDescriptor built from the Apps descriptor file.
 * @argument {AppLoader} loader - The AppLoader which loaded this App.
 * @argument {Array} moduleLoaders - An array of ModuleLoaders to use to load any declared app modules
 * @argument {AppStore} appStore - The store to use for persistence.
 * @argument {EventService} eventService - The Event service.
 */
class App{

  constructor(
    key,
    permission,
    descriptor,
    loader, 
    moduleLoaders,
    appStore,
    eventService
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"AppPermission","object":permission},
      {"shape":"AppDescriptor","object":descriptor},
      {"shape":"AppLoader","object":loader},
      {"shape":"AppModuleLoader","object":moduleLoaders[0]},
      {"shape":"AppStore","object":appStore},
      {"shape":"EventService","object":eventService}
    ]);

    this.key = key;
    this.permission = perission;
    this.uuid = uuidv4();
    this.descriptor = descriptor;
    this.loader = loader; 
    this.moduleLoaders = moduleLoaders;
    this.appStore = appStore;
    this.eventsService = eventService;
    this.securityContext = null;

    this.modules = [];
    
    this.bootstrap();

  }

  /**
   * @method bootstrap
   * @description bootstrap the app for example by setting up a 
   *              seurity context and communicating shared secrets 
   *              to the App for subsequent communication
   */
  async bootstrap(){

    // All Apps start disabled until bootstrap complete
    this.enabled = false;

    return new Promise(async (resolve, reject) => {

      // Get the type
      const type = this.getType();

      // App is dynamic so we need a custom client to communicate with 
      // the various service endpoints using desired auth
      if( type === "dynamic" ){
        const securityContext = new SecurityContext(this);
        // TODO: Can be other types of Client
        //const jwtClient = new JWTHttpClient(securityContext);
        // TODO: Implement this
        const jwtClient = new HttpClient();
        try{
          await jwtClient.init();
        }catch(e){
          return reject( new AppBootstrapError(e) );
        }
        this.httpClient = jwtClient;
      }
      // App is static so Just use a plain HttpClient
      else{
        this.httpClient = new HttpClient();
      }

      // HttpClient is setup so try to load this Apps modules.
      try{
        await this.loadModules();
      }catch(e){
        return reject( new AppBootstrapError(e) );
      }

      resolve();

    });

  }

  /**
   * @method getKey
   * @description return the unique key of this App
   */
  getKey(){
    return this.key;
  }

  /**
   * @method getPermission 
   * @description return the assigned permission of this App ("READ","WRITE","ADMIN")
   */
  getPermission(){
    return this.permission;
  }

    /**
   * @method getType
   * @description return the type of this App (static/dynamic)
   */
  getType(){
    return this.descriptor.getType();
  }

  /**
   * @method getUrl
   * @description Helper returns the base URL from this Apps descriptor
   */
  getUrl(){
    return this.descriptor.getUrl();
  }

  /**
   * @method getUUID
   * @description return the uniquely generated framework identifier of this App instance
   */
  getUUID(){
    return this.uuid;
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
   * @method getModules
   * @description return all the modules that have been loaded
   */
  getModules(){
    return this.modules;
  }

  /**
   * @method getHttpClient
   * @description return the Http client configured for this App
   */
  getHttpClient(){
    return this.httpClient;
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

    this.appDescriptor.getModules().forEach(moduleDescriptor =>{
      var module = null;
      var loaded = false;

      this.eventService.trigger(MODULE_LOAD_STARTED_EVENT, {
        "app" : this,
        "descriptor" : moduleDescriptor
      });

      this.appModuleLoaders.forEach(moduleLoader =>{
        try{
          if(!loaded && moduleLoader.canLoadModuleDescriptor(moduleDescriptor)){
            module = moduleLoader.loadModuleFromDescriptor(moduleDescriptor);
            if(module){
              loaded = true;
            } 
          }
        }catch(e){
          // Do nothing as another loader might handle it
        }
      });
      if(!module){
        // Here we could create a special UnloadableModule 
        // that is automatically disabled - that contains its own error
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