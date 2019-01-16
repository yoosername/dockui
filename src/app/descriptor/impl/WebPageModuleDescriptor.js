const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @class WebPageModuleDescriptor
 * @description Loads WebPage Module fields from a JSON descriptor
 */
class WebPageModuleDescriptor extends ModuleDescriptor{

    constructor(descriptor){

      super(descriptor);

      this.url = descriptor.url;

    }

    getURL(){
      return this.url;
    }
  
  }
  
  module.exports = WebPageModuleDescriptor;