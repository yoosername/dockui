const ModuleDescriptor = require("./ModuleDescriptor");

/**
 * @class AuthenticationProviderModuleDescriptor
 * @description Loads AuthenticationProvider fields from a JSON descriptor
 */
class AuthenticationProviderModuleDescriptor extends ModuleDescriptor{

    constructor(descriptor){

      super(descriptor);
      this.url = descriptor.url;

    }

    getURL(){
      return this.url;
    }
  
  }
  
  module.exports = AuthenticationProviderModuleDescriptor;