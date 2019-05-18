const Module = require("../Module");

/**
 * @description Represents an WebItem Module.
 */
class WebItemModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({
    url = null,
    text = "",
    location = null,
    tooltip = "",
    weight = "10"
  } = {}) {
    super(arguments);
    this.url = url;
    this.text = text;
    this.location = location;
    this.tooltip = tooltip;
    this.weight = weight;
  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl() {
    return this.url;
  }

  /**
   * @description The text to display in the Link
   */
  getText() {
    return this.text;
  }

  /**
   * @description Where this WebItem is intended to be injected.
   */
  getLocation() {
    return this.location;
  }

  /**
   * @description The hover text for this Web Item.
   */
  getTooltip() {
    return this.tooltip;
  }

  /**
   * @description The weight determines the order that the WebItem
   *              will be displayed starting at 0.
   */
  getWeight() {
    return this.weight;
  }
}

WebItemModule.DESCRIPTOR_TYPE = "WebItem";

module.exports = WebItemModule;
