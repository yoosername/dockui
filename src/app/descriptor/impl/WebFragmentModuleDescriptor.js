const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @description Loads WebFragment Module fields from a JSON descriptor
 */
class WebFragmentModuleDescriptor extends ModuleDescriptor{

    /**
     * @argument {JSON} descriptor
     */
    constructor(descriptor){

      super(descriptor);

      this.url = descriptor.url;
      this.selector = descriptor.selector;
      this.location = descriptor.location;

    }

    /**
     * @description Get URL of location Fragment is served from
     */
    getURL(){
      return this.url;
    }

    /**
     * @description Get CSS Selector of element wrapping fragment
     */
    getSelector(){
      return this.selector;
    }

    /**
     * @description Get Location to inject fragment
     */
    getLocation(){
      return this.location;
    }
  
  }
  
  module.exports = WebFragmentModuleDescriptor;