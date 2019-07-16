const Module = require("../Module");

/**
 * @description Represents an AuthorizationProvider Module.
 */
class AuthorizationProviderModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null, weight = "10" } = {}) {
    super(...arguments);
    this.type = AuthorizationProviderModule.DESCRIPTOR_TYPE;
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

  /**
   * @description Helper to return a serialized version of this Module for storage/transport
   * @returns {JSON} A Pure JSON representation of the Module
   */
  toJSON() {
    const json = Object.assign(super.toJSON(), {
      url: this.url,
      weight: this.weight,
      type: this.type
    });
    return json;
  }
}

AuthorizationProviderModule.DESCRIPTOR_TYPE = "AuthorizationProvider";

module.exports = AuthorizationProviderModule;
