const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @description Loads WebPage Module fields from a JSON descriptor
 */
class WebPageModuleDescriptor extends ModuleDescriptor {
  /**
   * @argument {JSON} descriptor
   */
  constructor(descriptor) {
    super(descriptor);

    this.url = descriptor.url;
  }

  /**
   * @description Get the URL of the endpoint serving the WebPage
   */
  getURL() {
    return this.url;
  }
}

module.exports = WebPageModuleDescriptor;
