const ModuleDescriptor = require("./ModuleDescriptor");

/**
 * @class WebItemModuleDescriptor
 * @description Loads WebItem Module fields from a JSON descriptor
 */
class WebItemModuleDescriptor extends ModuleDescriptor{

    constructor(descriptor){

      super(descriptor);

      this.url = descriptor.url;
      this.text = descriptor.text;
      this.location = descriptor.location;
      this.tooltip = descriptor.tooltip;

    }

    getURL(){
      return this.url;
    }

    getText(){
      return this.text;
    }

    getLocation(){
      return this.location;
    }

    getTooltip(){
      return this.tooltip;
    }
  
  }
  
  module.exports = WebItemModuleDescriptor;