const ModuleLoader = require("../ModuleLoader");
const AuthorizationProviderModule = require("../../../module/impl/AuthorizationProviderModule");

/**
 * @description Create a AuthorizationProviderModule from a descriptor
 */
class AuthorizationProviderModuleLoader extends ModuleLoader {
  constructor() {
    super();
  }

  /**
   * @description Return true if this descriptor can be parsed and is
   *              the required format to produce this type of Module
   * @argument {Object} descriptor The Module Descriptor to test
   */
  canLoadModuleDescriptor(descriptor) {
    if (descriptor.type === AuthorizationProviderModule.DESCRIPTOR_TYPE) {
      return true;
    }
  }

  /**
   * @description Create and return a new Module from the descriptor
   * @argument {Object} descriptor The Module Descriptor to test
   */
  loadModuleFromDescriptor(descriptor) {
    return new Promise(async (resolve, reject) => {
      if (descriptor && typeof descriptor === "object") {
        // Get initial shape from the descriptor
        const shape = {
          appId: descriptor.appId,
          type: descriptor.type,
          name: descriptor.name,
          key: descriptor.key,
          description: descriptor.description,
          url: descriptor.url,
          weight: descriptor.weight,
          cache: descriptor.cache,
          auth: descriptor.auth
        };
        // Create a Module from the shape and return it
        const module = new AuthorizationProviderModule(shape);
        resolve(module);
      }
    });
  }
}

module.exports = AuthorizationProviderModuleLoader;
