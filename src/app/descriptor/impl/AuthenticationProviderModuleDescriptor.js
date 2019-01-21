const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @description Loads AuthenticationProvider fields from a JSON descriptor
 */
class AuthenticationProviderModuleDescriptor extends ModuleDescriptor{

    /**
     * @argument {JSON} descriptor
     */
    constructor(descriptor){

      super(descriptor);
      this.url = descriptor.url;

    }

    /**
     * @description Get the URL of authentication endpoint
     */
    getURL(){
      return this.url;
    }
  
  }
  
  module.exports = AuthenticationProviderModuleDescriptor;