const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @description Loads API Module fields from a JSON descriptor
 */
class ApiModuleDescriptor extends ModuleDescriptor{

    /**
     * @argument {JSON} descriptor
     */
    constructor(descriptor){

      super(descriptor);

      this.version = descriptor.version;
      this.url = descriptor.url;

    }

    /**
     * @description Get the version of the API being provided
     */
    getVersion(){
      return this.version;
    }

    /**
     * @description Get URL to the API endpoint
     */
    getURL(){
      return this.url;
    }
  
  }
  
  module.exports = ApiModuleDescriptor;