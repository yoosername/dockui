const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @description Loads AuthorizationProvider fields from a JSON descriptor
 */
class AuthorizationProviderModuleDescriptor extends ModuleDescriptor {
  /**
   * @argument {JSON} descriptor
   */
  constructor(descriptor) {
    super(descriptor);
    this.url = descriptor.url;
  }

  /**
   * @description Get URL of Authorization endpoint
   */
  getURL() {
    return this.url;
  }
}

module.exports = AuthorizationProviderModuleDescriptor;
