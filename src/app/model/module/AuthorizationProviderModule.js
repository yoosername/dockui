const Module = require("./Module");

/**
 * @class AuthorizationProviderModule
 * @description Represents an AuthorizationProvider Module.
 * @extends Module
 * @argument {App} app - The App which loaded this module.
 * @argument {Object} descriptor - The descriptor used to load this module
 */
class AuthorizationProviderModule extends Module{

  constructor(
    app,
    descriptor
  ){
    super(app,descriptor);

    this.url = descriptor.url;
    this.weight = descriptor.weight;

  }

  /**
   * @method getUrl
   * @description The URL of the Provider relative to the App Url
   */
  getUrl(){
    return this.getUrl;
  }

  /**
   * @method getWeight
   * @description The weight determines when this provider will fire.
   *              lower numbers come first starting at 0.
   */
  getWeight(){
    return this.weight;
  }

}

module.exports = AuthorizationProviderModule;