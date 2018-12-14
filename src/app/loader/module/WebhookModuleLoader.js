/**
 * @class WebhookModuleLoader
 * @description Create a WebhookModule from a descriptor
 */
class WebhookModuleLoader{

  constructor(){}

  /**
   * @method canLoadModuleDescriptor
   * @description Return true if this descriptor can be arsed and is required format to produce this type of Module
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

module.exports = WebhookModuleLoader;