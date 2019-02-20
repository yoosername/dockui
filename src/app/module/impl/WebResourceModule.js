const Module = require("../Module");

/**
 * @description Represents an WebResource Module.
 */
class WebResourceModule extends Module {
  /**
   * @argument {App} app - The App which loaded this module.
   * @argument {Object} descriptor - The descriptor used to load this module
   */
  constructor(app, descriptor) {
    super(app, descriptor);

    this.url = descriptor.url;
    this.resources = descriptor.resources;
    this.context = descriptor.context;
    this.weight = descriptor.weight;
  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl() {
    return this.getUrl;
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
    return this.context;
  }
}

module.exports = WebResourceModule;
