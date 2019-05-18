const ModuleLoader = require("../ModuleLoader");
const ApiModule = require("../../../module/impl/ApiModule");

/**
 * @description Create a ApiModule from a descriptor
 */
class ApiModuleLoader extends ModuleLoader {
  constructor() {
    super();
  }

  /**
   * @description Return true if this descriptor can be parsed and is
   *              the required format to produce this type of Module
   * @argument {Object} descriptor The Module Descriptor to test
   */
  canLoadModuleDescriptor(descriptor) {
    if (descriptor.type === ApiModule.DESCRIPTOR_TYPE) {
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
          type: descriptor.type,
          name: descriptor.name,
          key: descriptor.key,
          version: descriptor.version,
          url: descriptor.url,
          weight: descriptor.weight,
          cache: descriptor.cache,
          roles: descriptor.roles
        };
        // Create a Module from the shape and return it
        const module = new ApiModule(shape);
        resolve(module);
      }
    });
  }
}

module.exports = ApiModuleLoader;
