const Module = require("./Module");

/**
 * @class RouteModule
 * @description Represents an Route Module.
 * @extends Module
 * @argument {App} app - The App which loaded this module.
 * @argument {Object} descriptor - The descriptor used to load this module
 */
class RouteModule extends Module{

  constructor(
    app,
    descriptor
  ){
    super(app,descriptor);

    this.routes = descriptor.routes;
    this.url = descriptor.url;

  }

  /**
   * @method getRoutes
   * @description The list of routes to forward to the URL
   */
  getRoutes(){
    return this.routes;
  }

  /**
   * @method getUrl
   * @description The App URL that we should forward our routes to
   */
  getUrl(){
    return this.url;
  }

}

module.exports = RouteModule;