const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @class WebResourceModuleDescriptor
 * @description Loads WebResource Module fields from a JSON descriptor
 */
class WebResourceModuleDescriptor extends ModuleDescriptor{

    constructor(descriptor){

      super(descriptor);

      this.url = descriptor.url;
      this.resources = descriptor.resources;
      this.context = descriptor.context;

    }

    getURL(){
      return this.url;
    }

    getResources(){
      return this.resources;
    }

    getContext(){
      return this.context;
    }
  
  }
  
  module.exports = WebResourceModuleDescriptor;