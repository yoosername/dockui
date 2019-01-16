const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @class AuthorizationProviderModuleDescriptor
 * @description Loads AuthorizationProvider fields from a JSON descriptor
 */
class AuthorizationProviderModuleDescriptor extends ModuleDescriptor{

    constructor(descriptor){

      super(descriptor);
      this.url = descriptor.url;

    }

    getURL(){
      return this.url;
    }
  
  }
  
  module.exports = AuthorizationProviderModuleDescriptor;