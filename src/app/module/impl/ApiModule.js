const Module = require("../Module");

/**
 * @class ApiModule
 * @description Represents an API Module.
 * @extends Module
 * @argument {App} app - The App which loaded this module.
 * @argument {Object} descriptor - The descriptor used to load this module
 */
class ApiModule extends Module{

  constructor(
    app,
    descriptor
  ){
    super(app,descriptor);

    this.version = descriptor.version;
    this.url = descriptor.url;

  }

  /**
   * @method getVersion
   * @description The version of the API
   */
  getVersion(){
    return this.version;
  }

  /**
   * @method getUrl
   * @description The URL of the API relative to the App Url
   */
  getUrl(){
    return this.getUrl;
  }

}

module.exports = ApiModule;