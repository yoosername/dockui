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
    super(arguments);
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
}

WebFragmentModule.DESCRIPTOR_TYPE = "WebFragment";

module.exports = WebFragmentModule;
