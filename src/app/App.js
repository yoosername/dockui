

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

const SecurityContext = require("./security/SecurityContext");

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

    // Always start disabled.
    this.enabled = false;

    this.modules = [];
    this.bootstrap();

  }

  /**
   * @description bootstrap the app for example by setting up a 
   *              security context and communicating shared secrets 
   *              to the App for subsequent communication
   */
  bootstrap(){

    // Load the modules defined in the descriptor
    this.loadModules();

    // Hydrate our state from the attached store
    // This will not enable or disable this app or its modules. That is performed by the LifeCycleEventsStrategy 
    this.load();

    // Get the type
    const type = this.getType();

    // App is dynamic so we need a custom client to communicate with 
    // the various service endpoints using desired auth
    if( type === "dynamic" ){
      
      if(!this.securityContext){
        this.securityContext = new SecurityContext(this);
        // Save state as we now have a Security Context to persist
        this.save();
      }
      
      // Attach a HttpClient customised to communicate with the Remote App
      // If it uses some kind of Auth then it has access to the SecurityContext via the App ref
      //this.httpClient = new JWTHttpClient(this);
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
  * @description Load this Apps state from the store if there is any
  */
  load(){
    const state = this.appStore.getState(this);
    if(state){
      this.uuid = (state.uuid) ? state.uuid : this.uuid;
      this.securityContext = (state.securityContext) ? state.securityContext : this.securityContext;
    }
  }

  /**
  * @description Return true if the App is currently enabled
  * @returns {Boolean} Return true if this App is currently enabled
  */
  isEnabled(){
    return this.enabled;
  }

  /**
   * @description return the unique key of this App
   * @returns {String} The Apps key
   */
  getKey(){
    return this.key;
  }

  /**
   * @description Returns the assigned AppPermission of this App.
   * @returns {AppPermission} The AppPermission granted to this App.
   * @example AppPermission.READ
   * @example AppPermission.WRITE
   * @example AppPermission.ADMIN
   */
  getPermission(){
    return this.permission;
  }

  /**
   * @description Return the type of this App
   * @returns {String} Type
   * @example "static" or "dynamic"
   */
  getType(){
    return this.descriptor.getType();
  }

  /**
   * @description Helper returns the base URL from this Apps descriptor
   * @returns {String} URL
   */
  getUrl(){
    return this.descriptor.getUrl();
  }

  /**
   * @description Return the uniquely generated framework identifier of this App instance
   * @returns {String} UUID
   */
  getUUID(){
    return this.uuid;
  }

  /**
   * @description Return the loader which loaded this App
   * @returns {AppLoader} AppLoader
   */
  getLoader(){
    return this.loader;
  }

  /**
   * @description Return the App Descriptor this App was parsed from
   * @returns {AppDescriptor} AppDescriptor
   */
  getDescriptor(){
    return this.descriptor;
  }

  /**
   * @description Return event service
   * @returns {EventService} EventService
   */
  getEventService(){
    return this.eventService;
  }

  /**
   * @description Return Module loaders which are available for parsing Module Descriptors
   * @returns {Array} Array of ModuleLoader
   */
  getModuleLoaders(){
    return this.moduleLoaders;
  }

  /**
   * @description Return all the modules that have been loaded (optionally filtered)
   * @returns {Array} Array of Module
   */
  getModules(filter){
    if(!filter){
      return this.modules;
    }
    return this.modules.filter(filter);
  }

  /**
   * @description return a single module by key
   * @returns {Module} A single Module that matches the passed key
   */
  getModule(key){
    const filtered = this.modules.filter((module)=>{return (module.getKey() === key);});
    return filtered[0];
  }

  /**
   * @description return the Http client configured for this App
   * @returns {HttpClient} HttpClient used for communicating with the App remotely
   */
  getHttpClient(){
    return this.httpClient;
  }

  /**
   * @description Toggle enabled flag, save state to store and and notify event listeners
   */
  enable(){
    this.enabled = true;
    this.save();
    this.eventService.emit(APP_ENABLED_EVENT, {
      "app" : this
    });
  }

  /**
   * @description Toggle enabled flag off, save state and notify event listeners
   */
  disable(){
    this.enabled = false;
    this.save();
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