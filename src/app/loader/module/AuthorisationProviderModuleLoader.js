/**
 * @class AuthorisationProviderModuleLoader
 * @description Create a AuthorisationProvider from a descriptor
 */
class AuthorisationProviderModuleLoader{

  constructor(){}

  /**
   * @method canLoadModuleDescriptor
   * @description Return true if this descriptor can be parsed and is 
   *              required format to produce this type of Module
   */
  canLoadModuleDescriptor(descriptor){
    // Parse config
    // Check and validate values
    // If can process to create a Module then return true;
  }

  /**
   * @method loadModuleFromDescriptor
   * @description Create and return a new Module from the descriptor
   */
  loadModuleFromDescriptor(descriptor){
    // Parse config
    // Check and validate values
    // create and return a new Module object;
  }

}

module.exports = AuthorisationProviderModuleLoader;