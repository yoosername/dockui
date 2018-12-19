const  {
  validateShapes
} = require("../../../util/validate");


/**
 * @class SecurityContext
 * @description Represents security info required to communicate
 *              with an APP. E.g. shared secrets etc
 */
class SecurityContext{

  constructor(
    store,
    app
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"AppStore","object":store},
      {"shape":"App","object":app}
    ]);

    this.store = store;
    this.app = app; 

  }

  /**
   * @method getApp
   * @description return the App this security context is for
   */
  getApp(){
    return this.app;
  }

  /**
   * @method getStore
   * @description return the Store we are using for persistence
   */
  getStore(){
    return this.store;
  }

  /**
   * @method handshake
   * @description Attempt to connect to the App loaded lifecycle URL
   *              and POST our Security Context expecting 200 OK in return
   */
  handshake(){
    // POST Security context to APP. If 200 OK then return true.
    // If not then return false;
  }


}

module.exports = SecurityContext;