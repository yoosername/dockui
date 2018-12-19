const  {
  validateShapes
} = require("../../../util/validate");

const  {
  MODULE_ENABLED_EVENT,
  MODULE_DISABLED_EVENT
} = require("../../../constants/events");

/**
 * @class Module
 * @description Represents a single Module loaded from a Module Descriptor.
 * @argument {App} app - The App which loaded this module.
 * @argument {App} descriptor - The module descriptor used to load the module
 */
class Module{

  constructor(
    app,
    descriptor
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"App","object":app},
      {"shape":"ModuleDescriptor","object":descriptor}
    ]);

    this.app = app; 
    this.eventService = app.getEventService();
    this.descriptor = descriptor; 
    this.key = descriptor.getKey();
    this.name = descriptor.getName();
    this.type = descriptor.getType();

    if(descriptor.getCache()){
      this.cache = descriptor.getCache();
    }

    if(descriptor.getRoles()){
      this.roles = descriptor.getRoles();
    }

  }

  /**
   * @method getKey
   * @description The key of this Module
   */
  getKey(){
    return this.key;
  }

  /**
   * @method getName
   * @description The Human readable name of this Module
   */
  getName(){
    return this.name;
  }

  /**
   * @method getType
   * @description The type of this Module
   */
  getType(){
    return this.type;
  }

  /**
   * @method getRoles
   * @description Return the roles are required to use this module
   *              or Null if no Roles required.
   */
  getRoles(){
    return (
      this.roles &&
      this.roles.length &&
      this.roles.length >= 0 
    ) ? this.roles : null;
  }

  /**
   * @method getCache
   * @description Return the roles are required to use this module
   *              or Null if no Roles required.
   */
  getCache(){
    return (
      this.cache &&
      this.cache.policy
    ) ? this.cache : {policy: "disabled"};
  }

  /**
   * @method isCacheEnabled
   * @description If Caching is supported and enabled by this module
   */
  isCacheEnabled(){
    return (
      this.cache &&
      this.cache.policy &&
      this.cache.policy === "enabled"
    ) ? true : false;
  }

  /**
   * @method enable
   * @description default behaviour is to simply send an enabled event to all listeners.
   *              subclasses can extend this behaviour
   */
  enable(){
    this.eventService.trigger(MODULE_ENABLED_EVENT, {
      "module" : this
    });
  }

  /**
   * @method disable
   * @description default behaviour is to simply send an disabled event to all listeners.
   *              subclasses can extend this behaviour
   */
  disable(){
    this.eventService.trigger(MODULE_DISABLED_EVENT, {
      "module" : this
    });
  }

}

module.exports = Module;