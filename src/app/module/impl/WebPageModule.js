const Module = require("../Module");

/**
 * @description Represents an WebPage Module.
 */
class WebPageModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null, decorator = null } = {}) {
    super(...arguments);
    this.type = WebPageModule.DESCRIPTOR_TYPE;
    this.url = url;
    this.decorator = decorator;
  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl() {
    return this.url;
  }

  /**
   * @description The id of the module which will act as a decorator for this page
   */
  getDecorator() {
    return this.decorator;
  }

  /**
   * @description Helper to return a serialized version of this Module for storage/transport
   * @returns {JSON} A Pure JSON representation of the Module
   */
  toJSON() {
    const json = Object.assign(super.toJSON(), {
      url: this.url,
      type: this.type,
      decorator: this.decorator
    });
    return json;
  }
}

WebPageModule.DESCRIPTOR_TYPE = "WebPage";

module.exports = WebPageModule;
