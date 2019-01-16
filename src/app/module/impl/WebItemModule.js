const Module = require("../Module");

/**
 * @description Represents an WebItem Module.
 */
class WebItemModule extends Module{

  /**
   * @argument {App} app - The App which loaded this module.
   * @argument {Object} descriptor - The descriptor used to load this module
   */
  constructor(
    app,
    descriptor
  ){
    super(app,descriptor);

    this.url = descriptor.url;
    this.text = descriptor.text;
    this.location = descriptor.location;
    this.tooltip = descriptor.tooltip;
    this.weight = descriptor.weight;

  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl(){
    return this.getUrl;
  }

  /**
   * @description The text to display in the Link
   */
  getText(){
    return this.text;
  }

  /**
   * @description Where this WebItem is intended to be injected.
   */
  getLocation(){
    return this.location;
  }

  /**
   * @description The hover text for this Web Item.
   */
  getTooltip(){
    return this.tooltip;
  }

  /**
   * @description The weight determines the order that the WebItem
   *              will be displayed starting at 0.
   */
  getWeight(){
    return this.weight;
  }

}

module.exports = WebItemModule;