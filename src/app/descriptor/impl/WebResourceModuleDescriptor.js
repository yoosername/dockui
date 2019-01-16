const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @description Loads WebResource Module fields from a JSON descriptor
 */
class WebResourceModuleDescriptor extends ModuleDescriptor{

    /**
     * @argument {JSON} descriptor
     */
    constructor(descriptor){

      super(descriptor);

      this.url = descriptor.url;
      this.resources = descriptor.resources;
      this.context = descriptor.context;

    }

    /**
     * @description Get the Base URL of the endpoint serving the static resources
     */
    getURL(){
      return this.url;
    }

    /**
     * @description Get relative URL of the provided Resources
     */
    getResources(){
      return this.resources;
    }

    /**
     * @description Get the context location where these resources should be injected
     */
    getContext(){
      return this.context;
    }
  
  }
  
  module.exports = WebResourceModuleDescriptor;