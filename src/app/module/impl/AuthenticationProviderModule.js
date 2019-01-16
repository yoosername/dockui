const Module = require("../Module");

/**
 * @description Represents an Authentication Provider Module.
 */
class AuthenticationProviderModule extends Module{

  /**
   * @argument {App} app - The App which loaded this module.
   * @argument {Object} descriptor - The descriptor used to load this module
   */
  constructor(
    app,
    descriptor
  ){
    super(app,descriptor);

    this.url = descriptor.url;
    this.weight = descriptor.weight;

  }

  /**
   * @description The URL of the Provider relative to the App Url
   */
  getUrl(){
    return this.getUrl;
  }

  /**
   * @description The weight determines when this provider will fire.
   *              lower numbers come first starting at 0.
   */
  getWeight(){
    return this.weight;
  }

}

module.exports = AuthenticationProviderModule;