const  {
  validateShapes
} = require("../../util/validate");

const uuidv4 = require('uuid/v4');
const SECURITY_CONTEXT_STORE_PREFIX = "security-context_";

/**
 * @class SecurityContext
 * @description Represents security info required to communicate
 *              with an APP. E.g. shared secrets etc
 */
class SecurityContext{

  constructor(
    app
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"App","object":app}
    ]);

    this.app = app;
    this.context = {};
    this.getContext();

  }

  /**
   * @method getApp
   * @description return the App this security context is for
   */
  getApp(){
    return this.app;
  }

  /**
   * @method getContext
   * @description Load context from the following in order:
   *               - Cache
   *               - Apps store if exists 
   *               - or generate New One and store it
   */
  getContext(){
    // Fetch from local cache
    var context = this.context;
    if(context){
      return context;
    }

    // Otherwise load from store into local cache
    context = this.app.getStore().get(SECURITY_CONTEXT_STORE_PREFIX+this.app.getUUID());
    if( context && context.key && context.secret ){
      this.context = context;
      return context;
    }
    
    // Otherwise create a new one and save to store and cache
    context = this.generateNewContext();
    this.app.getStore().set(SECURITY_CONTEXT_STORE_PREFIX+this.app.getUUID(), context);
    this.context = context;
    return context;
  }

  /**
   * @method generateNewContext
   * @description Generate a unique context with apps key and fresh secret etc
   * {
   *       key: key-from-app-descriptor,
   *       uuid: framework-unique-identifier-of-App,
   *       secret: a-secret-used-for-jwt-signing-etc,
   *       framework.url: https://base.url.of.the.calling.framework.instance
   * }
   */
  generateNewContext(){
    return {
      key : this.app.getKey(), 
      uuid: this.app.getUUID(), 
      secret : uuidv4()
    };
  }


}

module.exports = SecurityContext;