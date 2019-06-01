const Module = require("../Module");
const DEFAULT_CONTEXT = "app.general";

/**
 * @description Represents an WebResource Module.
 */
class WebResourceModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({
    url = null,
    resources = [],
    context = DEFAULT_CONTEXT,
    weight = "10"
  } = {}) {
    super(...arguments);
    this.type = WebResourceModule.DESCRIPTOR_TYPE;
    this.url = url;
    this.resources = resources;
    this.context = context;
    this.weight = weight;
  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl() {
    return this.url;
  }

  /**
   * @description The list of JS/CSS Resource objects where:
   *              type := JS, CSS
   *              path := path relative to getUrl()
   */
  getResources() {
    return this.resources;
  }

  /**
   * @description The context to inject the resources into for example
   *              A particular page or set of pages may choose a context
   *              and all resources which target that context will be injected
   */
  getContext() {
    return this.context;
  }

  /**
   * @description The order with which to inject these web resources.
   *              Starts at 0 and goes higher.
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
      resources: this.resources,
      context: this.context,
      weight: this.weight,
      type: this.type
    });
    return json;
  }
}

WebResourceModule.DESCRIPTOR_TYPE = "WebResource";

module.exports = WebResourceModule;
