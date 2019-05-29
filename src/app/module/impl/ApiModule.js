const Module = require("../Module");

/**
 * @description Represents an API Module.
 */
class ApiModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null, version = "1.0.0" } = {}) {
    super(...arguments);
    this.url = url;
    this.type = ApiModule.DESCRIPTOR_TYPE;
    this.version = version;
  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl() {
    return this.url;
  }

  /**
   * @description The version of the API
   */
  getVersion() {
    return this.version;
  }

  /**
   * @description Helper to return a serialized version of this Module for storage/transport
   * @returns {JSON} A Pure JSON representation of the Module
   */
  toJSON() {
    const json = Object.assign(super.toJSON(), {
      url: this.url,
      version: this.version,
      type: this.type
    });
    return json;
  }
}

ApiModule.DESCRIPTOR_TYPE = "Api";

module.exports = ApiModule;
