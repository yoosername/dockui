

const uuidv4 = require('uuid/v4');
const HttpClient = require("./http/HttpClient");

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

const fetchExistingOrCreateNewUUID = (store, app)=>{
  
};

/**
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
      {"shape":"AppDescriptor","object":descriptor},
      {"shape":"AppLoader","object":loader},
      {"shape":"ModuleLoader","object":moduleLoaders[0]},
      {"shape":"AppStore","object":appStore},
      {"shape":"EventService","object":eventService}
    ]);

    this.key = key;
    this.permission = permission;
    this.uuid = uuidv4();
    this.descriptor = descriptor;
    this.loader = loader; 
    this.moduleLoaders = moduleLoaders;
    this.appStore = appStore;
    this.eventService = eventService;
    this.securityContext = null;

    this.modules = [];
    this.bootstrap();

  }

  /**
   * @description bootstrap the app for example by setting up a 
   *              security context and communicating shared secrets 
   *              to the App for subsequent communication
   */
  bootstrap(){

    // All Apps start disabled until bootstrap complete
    this.enabled = false;

    // Load our Modules
    this.loadModules();

    // Hydrate from store
    this.load();

    // TODO: Store SecurityContext & authType in the store, so only booptstrap if havent dope before

    // Get the type
    const type = this.getType();

    // App is dynamic so we need a custom client to communicate with 
    // the various service endpoints using desired auth
    if( type === "dynamic" ){
      const securityContext = new SecurityContext(this);
      // TODO: Need to switch clients based on theC ype and auth required
      // Temporarily using simple one without auth
      //const jwtClient = new JWTHttpClient(securityContext);        
      this.httpClient = new HttpClient(this);
    }
    // App is static so Just use a plain HttpClient
    else{
      this.httpClient = new HttpClient(this);
    }

  }

  /**
  * @description Save this App state to the store
  */
  save(){
    this.appStore.saveState(this);
  }

  /**
  * @description Load this App state from the store
  */
  load(){
    const state = this.appStore.getState(this);
    this.uuid = state.uuid;
    this.key = state.key;
    this.enabled = (state.enabled) ? true : false;
  }

  /**
  * @description Return true if the App is currently enabled
  */
  isEnabled(){
    return this.enabled;
  }

  /**
   * @description return the unique key of this App
   */
  getKey(){
    return this.key;
  }

  /**
   * @description return the assigned permission of this App ("READ","WRITE","ADMIN")
   */
  getPermission(){
    return this.permission;
  }

  /**
   * @description return the type of this App (static/dynamic)
   */
  getType(){
    return this.descriptor.getType();
  }

  /**
   * @description Helper returns the base URL from this Apps descriptor
   */
  getUrl(){
    return this.descriptor.getUrl();
  }

  /**
   * @description return the uniquely generated framework identifier of this App instance
   */
  getUUID(){
    return this.uuid;
  }

  /**
   * @description return the loader which loaded this App
   */
  getLoader(){
    return this.loader;
  }

  /**
   * @description return the App Descriptor this App was parsed from
   */
  getDescriptor(){
    return this.descriptor;
  }

  /**
   * @description return event service
   */
  getEventService(){
    return this.eventService;
  }

  /**
   * @description return Module loaders which are available for parsing Module Descriptors
   */
  getModuleLoaders(){
    return this.moduleLoaders;
  }

  /**
   * @description return all the modules that have been loaded (optionally filtered)
   */
  getModules(filter){
    if(!filter){
      return this.modules;
    }
    return this.modules.filter(filter);
  }

  /**
   * @description return a single module by key
   */
  getModule(key){
    const filtered = this.modules.filter((module)=>{return (module.getKey() === key);});
    return filtered[0];
  }

  /**
   * @description return the Http client configured for this App
   */
  getHttpClient(){
    return this.httpClient;
  }

  /**
   * @description Toggle enabled flag and notify event listeners
   */
  enable(){
    this.enabled = true;
    this.eventService.emit(APP_ENABLED_EVENT, {
      "app" : this
    });
  }

  /**
   * @description Toggle enabled flag and notify event listeners
   */
  disable(){
    this.enabled = false;
    this.eventService.emit(APP_DISABLED_EVENT, {
      "app" : this
    });
  }

  /**
   * @description Try to parse the descriptor.modules and load 
   * all the modules in it using any of the passed in ModuleLoaders
   * Unloadable modules are loaded anyway but automatically disabled
   */
  loadModules(){

    this.descriptor.getModules().forEach(moduleDescriptor =>{
      var module = null;
      var loaded = false;

      this.eventService.emit(MODULE_LOAD_STARTED_EVENT, {
        "app" : this,
        "descriptor" : moduleDescriptor
      });

      this.moduleLoaders.forEach(moduleLoader =>{
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
        this.eventService.emit(MODULE_LOAD_COMPLETE_EVENT, {
          "app" : this,
          "descriptor" : moduleDescriptor,
          "module" : module
        });
      }else{
        this.eventService.emit(MODULE_LOAD_FAILED_EVENT, {
          "app" : this,
          "descriptor" : moduleDescriptor
        });
      }
    });

  }

}

module.exports = App;