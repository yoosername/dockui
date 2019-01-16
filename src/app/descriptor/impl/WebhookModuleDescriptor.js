const ModuleDescriptor = require("../ModuleDescriptor");

/**
 * @description Loads Webhook Module fields from a JSON descriptor
 */
class WebhookModuleDescriptor extends ModuleDescriptor{

    /**
     * @argument {JSON} descriptor
     */
    constructor(descriptor){

      super(descriptor);
      this.url = descriptor.url;
      this.events = descriptor.events;

    }

    /**
     * @description Get URL of Webhook endpoint
     */
    getURL(){
      return this.url;
    }

    /**
     * @description Get WebHook Events App is interested in listening to
     */
    getEvents(){
      return this.events;
    }
  
  }
  
  module.exports = WebhookModuleDescriptor;