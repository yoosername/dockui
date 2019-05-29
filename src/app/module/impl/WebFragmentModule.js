const Module = require("../Module");

/**
 * @description Represents a WebFragment Module.
 */
class WebFragmentModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({
    url = null,
    selector = "",
    location = null,
    weight = "10"
  } = {}) {
    super(...arguments);
    this.type = WebFragmentModule.DESCRIPTOR_TYPE;
    this.url = url;
    this.selector = selector;
    this.location = location;
    this.weight = weight;
  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl() {
    return this.url;
  }

  /**
   * @description The CSS Selector to use to parse out the fragment body
   *              from the HTML retrieved from getURL()
   */
  getSelector() {
    return this.selector;
  }

  /**
   * @description The location to inject the fragment
   */
  getLocation() {
    return this.location;
  }

  /**
   * @description The weight determines the order that the WebFragment
   *              will be displayed starting at 0.
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
      selector: this.selector,
      location: this.location,
      weight: this.weight,
      type: this.type
    });
    return json;
  }
}

WebFragmentModule.DESCRIPTOR_TYPE = "WebFragment";

module.exports = WebFragmentModule;
