const ModuleLoader = require("../ModuleLoader");
const RouteModule = require("../../../module/impl/RouteModule");

/**
 * @description Create a WebFragmentModule from a descriptor
 */
class RouteModuleLoader extends ModuleLoader {
  constructor() {
    super();
  }

  /**
   * @description Return true if this descriptor can be parsed and is
   *              the required format to produce this type of Module
   * @argument {Object} descriptor The Module Descriptor to test
   */
  canLoadModuleDescriptor(descriptor) {
    if (descriptor.type === RouteModule.DESCRIPTOR_TYPE) {
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
          routes: descriptor.routes,
          weight: descriptor.weight,
          auth: descriptor.auth,
          cache: descriptor.cache
        };
        // Create a Module from the shape and return it
        const module = new RouteModule(shape);
        resolve(module);
      }
    });
  }
}

module.exports = RouteModuleLoader;
