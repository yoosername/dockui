const Module = require("../Module");

/**
 * @description Represents an WebPage Module.
 */
class WebPageModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null } = {}) {
    super(arguments);
    this.url = url;
  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl() {
    return this.url;
  }
}

WebPageModule.DESCRIPTOR_TYPE = "WebPage";

module.exports = WebPageModule;
