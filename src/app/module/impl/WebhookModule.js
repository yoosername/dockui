const Module = require("../Module");

/**
 * @description Represents a Webhook Module.
 */
class WebhookModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null, events = [] } = {}) {
    super(arguments);
    this.url = url;
    this.events = events;
  }

  /**
   * @description The URL of the webhook relative to the App Url
   */
  getUrl() {
    return this.url;
  }

  /**
   * @description The list of events that wewant to be notified about
   */
  getEvents() {
    return this.events;
  }
}

WebhookModule.DESCRIPTOR_TYPE = "Webhook";

module.exports = WebhookModule;
