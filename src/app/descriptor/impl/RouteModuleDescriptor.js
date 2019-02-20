const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @description Loads Route Module fields from a JSON descriptor
 */
class RouteModuleDescriptor extends ModuleDescriptor {
  /**
   * @argument {JSON} descriptor
   */
  constructor(descriptor) {
    super(descriptor);

    this.routes = descriptor.routes;
    this.url = descriptor.url;
  }

  /**
   * @description Get Routes that need translating into real URL
   */
  getRoutes() {
    return this.routes;
  }

  /**
   * @description Get Real URL to translate the Routes into
   */
  getURL() {
    return this.url;
  }
}

module.exports = RouteModuleDescriptor;
