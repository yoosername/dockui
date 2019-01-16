const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @class RouteModuleDescriptor
 * @description Loads Route Module fields from a JSON descriptor
 */
class RouteModuleDescriptor extends ModuleDescriptor{

    constructor(descriptor){

      super(descriptor);

      this.routes = descriptor.routes;
      this.url = descriptor.url;

    }

    getRoutes(){
      return this.routes;
    }

    getURL(){
      return this.url;
    }
  
  }
  
  module.exports = RouteModuleDescriptor;