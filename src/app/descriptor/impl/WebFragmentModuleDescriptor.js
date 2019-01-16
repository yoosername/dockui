const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @class WebFragmentModuleDescriptor
 * @description Loads WebFragment Module fields from a JSON descriptor
 */
class WebFragmentModuleDescriptor extends ModuleDescriptor{

    constructor(descriptor){

      super(descriptor);

      this.url = descriptor.url;
      this.selector = descriptor.selector;
      this.location = descriptor.location;

    }

    getURL(){
      return this.url;
    }

    getSelector(){
      return this.selector;
    }

    getLocation(){
      return this.location;
    }
  
  }
  
  module.exports = WebFragmentModuleDescriptor;