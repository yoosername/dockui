const Module = require("../Module");

/**
 * @description Represents an WebPage Module.
 */
class WebPageModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null } = {}) {
    super(...arguments);
    this.type = WebPageModule.DESCRIPTOR_TYPE;
    this.url = url;
  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl() {
    return this.url;
  }

  /**
   * @description Helper to return a serialized version of this Module for storage/transport
   * @returns {JSON} A Pure JSON representation of the Module
   */
  toJSON() {
    const json = Object.assign(super.toJSON(), {
      url: this.url,
      type: this.type
    });
    return json;
  }
}

WebPageModule.DESCRIPTOR_TYPE = "WebPage";

module.exports = WebPageModule;
