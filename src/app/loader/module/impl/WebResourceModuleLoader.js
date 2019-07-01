const ModuleLoader = require("../ModuleLoader");
const WebResourceModule = require("../../../module/impl/WebResourceModule");

/**
 * @description Create a WebResourceModule from a descriptor
 */
class WebResourceModuleLoader extends ModuleLoader {
  constructor() {
    super();
  }

  /**
   * @description Return true if this descriptor can be parsed and is
   *              the required format to produce this type of Module
   * @argument {Object} descriptor The Module Descriptor to test
   */
  canLoadModuleDescriptor(descriptor) {
    if (descriptor.type === WebResourceModule.DESCRIPTOR_TYPE) {
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
          key: descriptor.key,
          name: descriptor.name,
          description: descriptor.description,
          aliases: descriptor.aliases,
          resources: descriptor.resources,
          url: descriptor.url,
          type: descriptor.type,
          description: descriptor.description,
          auth: descriptor.auth,
          cache: descriptor.cache,
          context: descriptor.context
        };
        // Create a Module from the shape and return it
        const module = new WebResourceModule(shape);
        resolve(module);
      }
    });
  }
}

module.exports = WebResourceModuleLoader;
