const Module = require("../Module");

/**
 * @description Represents a Webhook Module.
 */
class WebhookModule extends Module {
  /**
   * @argument {App} app - The App which loaded this module.
   * @argument {Object} descriptor - The descriptor used to load this module
   */
  constructor(app, descriptor) {
    super(app, descriptor);

    this.url = descriptor.url;
    this.events = descriptor.events;
  }

  /**
   * @description The URL of the webhook relative to the App Url
   */
  getUrl() {
    return this.getUrl;
  }

  /**
   * @description The list of events that wewant to be notified about
   */
  getEvents() {
    return this.events;
  }
}

module.exports = WebhookModule;
