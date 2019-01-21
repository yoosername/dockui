const Module = require("../Module");

/**
 * @description Represents an API Module.
 */
class ApiModule extends Module{

  /**
   * @argument {App} app - The App which loaded this module.
   * @argument {Object} descriptor - The descriptor used to load this module
   */
  constructor(
    app,
    descriptor
  ){
    super(app,descriptor);

    this.version = descriptor.version;
    this.url = descriptor.url;

  }

  /**
   * @description The version of the API
   */
  getVersion(){
    return this.version;
  }

  /**
   * @description The URL of the API relative to the App Url
   */
  getUrl(){
    return this.getUrl;
  }

}

module.exports = ApiModule;