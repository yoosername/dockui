const Module = require("../Module");

/**
 * @description Represents a Webhook Module.
 */
class WebhookModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null, events = [] } = {}) {
    super(...arguments);
    this.type = WebhookModule.DESCRIPTOR_TYPE;
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

  /**
   * @description Helper to return a serialized version of this Module for storage/transport
   * @returns {JSON} A Pure JSON representation of the Module
   */
  toJSON() {
    const json = Object.assign(super.toJSON(), {
      url: this.url,
      events: this.events,
      type: this.type
    });
    return json;
  }
}

WebhookModule.DESCRIPTOR_TYPE = "Webhook";

module.exports = WebhookModule;
