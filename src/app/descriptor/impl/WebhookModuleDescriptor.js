const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @class WebhookModuleDescriptor
 * @description Loads Webhook Module fields from a JSON descriptor
 */
class WebhookModuleDescriptor extends ModuleDescriptor{

    constructor(descriptor){

      super(descriptor);
      this.url = descriptor.url;
      this.events = descriptor.events;

    }

    getURL(){
      return this.url;
    }

    getEvents(){
      return this.events;
    }
  
  }
  
  module.exports = WebhookModuleDescriptor;