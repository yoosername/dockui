/**
 * @class WebResourceModuleLoader
 * @description Create a WebResourceModule from a descriptor
 */
class WebResourceModuleLoader{

  constructor(){}

  /**
   * @method canLoadModuleDescriptor
   * @description Return true if this descriptor can be parsed and is required format to produce this type of Module
   */
  canLoadModuleDescriptor(descriptor){
    // Parse config
    // Check and validate values
    // If can process to create a RouteModule then return true;
  }

  /**
   * @method loadModuleFromDescriptor
   * @description Create and return a new RouteModule from the descriptor
   */
  loadModuleFromDescriptor(descriptor){
    // Parse config
    // Check and validate values
    // create and return a new RouteModule object;
  }

}

module.exports = WebResourceModuleLoader;