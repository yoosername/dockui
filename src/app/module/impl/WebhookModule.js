const Module = require("../Module");

/**
 * @class WebhookModule
 * @description Represents a Webhook Module.
 * @extends Module
 * @argument {App} app - The App which loaded this module.
 * @argument {Object} descriptor - The descriptor used to load this module
 */
class WebhookModule extends Module{

  constructor(
    app,
    descriptor
  ){
    super(app,descriptor);

    this.url = descriptor.url;
    this.events = descriptor.events;
  }

  /**
   * @method getUrl
   * @description The URL of the webhook relative to the App Url
   */
  getUrl(){
    return this.getUrl;
  }

  /**
   * @method getEvents
   * @description The list of events that wewant to be notified about
   */
  getEvents(){
    return this.events;
  }

}

module.exports = WebhookModule;