const Module = require("../Module");

/**
 * @class WebFragmentModule
 * @description Represents a WebFragment Module.
 * @extends Module
 * @argument {App} app - The App which loaded this module.
 * @argument {Object} descriptor - The descriptor used to load this module
 */
class WebFragmentModule extends Module{

  constructor(
    app,
    descriptor
  ){
    super(app,descriptor);

    this.url = descriptor.url;
    this.selector = descriptor.selector;
    this.location = descriptor.location;
    this.weight = descriptor.weight;

  }

  /**
   * @method getUrl
   * @description The URL of the API relative to the App Url
   */
  getUrl(){
    return this.getUrl;
  }

  /**
   * @method getSelector
   * @description The CSS Selector to use to parse out the fragment body
   *              from the HTML retrieved from getURL()
   */
  getSelector(){
    return this.version;
  }

  /**
   * @method getLocation
   * @description The location to inject the fragment
   */
  getLocation(){
    return this.location;
  }

  /**
   * @method getWeight
   * @description The weight determines the order that the WebFragment
   *              will be displayed starting at 0.
   */
  getWeight(){
    return this.weight;
  }

}

module.exports = WebFragmentModule;