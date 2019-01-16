const Module = require("../Module");

/**
 * @description Represents a WebFragment Module.
 */
class WebFragmentModule extends Module{

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
    this.selector = descriptor.selector;
    this.location = descriptor.location;
    this.weight = descriptor.weight;

  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl(){
    return this.getUrl;
  }

  /**
   * @description The CSS Selector to use to parse out the fragment body
   *              from the HTML retrieved from getURL()
   */
  getSelector(){
    return this.version;
  }

  /**
   * @description The location to inject the fragment
   */
  getLocation(){
    return this.location;
  }

  /**
   * @description The weight determines the order that the WebFragment
   *              will be displayed starting at 0.
   */
  getWeight(){
    return this.weight;
  }

}

module.exports = WebFragmentModule;