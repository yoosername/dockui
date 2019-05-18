const ModuleLoader = require("../ModuleLoader");
const WebPageModule = require("../../../module/impl/WebPageModule");

/**
 * @description Create a WebkPageModuleLoader from a descriptor
 */
class WebPageModuleLoader extends ModuleLoader {
  constructor() {
    super();
  }

  /**
   * @description Return true if this descriptor can be parsed and is
   *              the required format to produce this type of Module
   * @argument {Object} descriptor The Module Descriptor to test
   */
  canLoadModuleDescriptor(descriptor) {
    if (descriptor.type === WebPageModule.DESCRIPTOR_TYPE) {
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
          url: descriptor.url,
          cache: descriptor.cache,
          roles: descriptor.roles
        };
        // Create a Module from the shape and return it
        const module = new WebPageModule(shape);
        resolve(module);
      }
    });
  }
}

module.exports = WebPageModuleLoader;
