const ModuleLoader = require("../ModuleLoader");
const WebItemModule = require("../../../module/impl/WebItemModule");

/**
 * @description Create a WebItemModule from a descriptor
 */
class WebItemModuleLoader extends ModuleLoader {
  constructor() {
    super();
  }

  /**
   * @description Return true if this descriptor can be parsed and is
   *              the required format to produce this type of Module
   * @argument {Object} descriptor The Module Descriptor to test
   */
  canLoadModuleDescriptor(descriptor) {
    if (descriptor.type === WebItemModule.DESCRIPTOR_TYPE) {
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
          location: descriptor.location,
          tooltip: descriptor.tooltip,
          weight: descriptor.weight,
          cache: descriptor.cache
        };
        // Create a Module from the shape and return it
        const module = new WebItemModule(shape);
        resolve(module);
      }
    });
  }
}

module.exports = WebItemModuleLoader;
