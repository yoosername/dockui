const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @description Loads WebItem Module fields from a JSON descriptor
 */
class WebItemModuleDescriptor extends ModuleDescriptor{

    /**
     * @argument {JSON} descriptor
     */
    constructor(descriptor){

      super(descriptor);

      this.url = descriptor.url;
      this.text = descriptor.text;
      this.location = descriptor.location;
      this.tooltip = descriptor.tooltip;

    }

    /**
     * @description Get URL of WebItem
     */
    getURL(){
      return this.url;
    }

    /**
     * @description Get Text of WebItem
     */
    getText(){
      return this.text;
    }

    /**
     * @description Get Location to inject WebItem
     */
    getLocation(){
      return this.location;
    }

    /**
     * @description Get WebItem Tooltip
     */
    getTooltip(){
      return this.tooltip;
    }
  
  }
  
  module.exports = WebItemModuleDescriptor;