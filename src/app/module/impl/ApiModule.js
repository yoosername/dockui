const Module = require("../Module");

/**
 * @description Represents an API Module.
 */
class ApiModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null, version = "1.0.0" } = {}) {
    super(arguments);
    this.url = url;
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
}

ApiModule.DESCRIPTOR_TYPE = "Api";

module.exports = ApiModule;
