const Module = require("../Module");

/**
 * @description Represents an Authentication Provider Module.
 */
class AuthenticationProviderModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null, weight = "10" } = {}) {
    super(arguments);
    this.url = url;
    this.weight = weight;
  }

  /**
   * @description The URL of the Provider relative to the App Url
   */
  getUrl() {
    return this.url;
  }

  /**
   * @description The weight determines when this provider will fire.
   *              lower numbers come first starting at 0.
   */
  getWeight() {
    return this.weight;
  }
}

AuthenticationProviderModule.DESCRIPTOR_TYPE = "AuthenticationProvider";

module.exports = AuthenticationProviderModule;
