const Module = require("../Module");

/**
 * @description Represents an WebPage Module.
 */
class WebPageModule extends Module{

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

  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl(){
    return this.getUrl;
  }

}

module.exports = WebPageModule;