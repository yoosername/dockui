const Module = require("./Module");

/**
 * @class WebPageModule
 * @description Represents an WebPage Module.
 * @extends Module
 * @argument {App} app - The App which loaded this module.
 * @argument {Object} descriptor - The descriptor used to load this module
 */
class WebPageModule extends Module{

  constructor(
    app,
    descriptor
  ){
    super(app,descriptor);

    this.url = descriptor.url;

  }

  /**
   * @method getUrl
   * @description The URL of the API relative to the App Url
   */
  getUrl(){
    return this.getUrl;
  }

}

module.exports = WebPageModule;