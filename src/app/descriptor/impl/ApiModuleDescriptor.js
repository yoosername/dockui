const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @class ApiModuleDescriptor
 * @description Loads API Module fields from a JSON descriptor
 */
class ApiModuleDescriptor extends ModuleDescriptor{

    constructor(descriptor){

      super(descriptor);

      this.version = descriptor.version;
      this.url = descriptor.url;

    }

    getVersion(){
      return this.version;
    }

    getURL(){
      return this.url;
    }
  
  }
  
  module.exports = ApiModuleDescriptor;