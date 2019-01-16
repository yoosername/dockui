const Module = require("../Module");

/**
 * @description Represents an Route Module.
 */
class RouteModule extends Module{

  /**
   * @argument {App} app - The App which loaded this module.
   * @argument {Object} descriptor - The descriptor used to load this module
   */
  constructor(
    app,
    descriptor
  ){
    super(app,descriptor);

    this.routes = descriptor.routes;
    this.url = descriptor.url;

  }

  /**
   * @description The list of routes to forward to the URL
   */
  getRoutes(){
    return this.routes;
  }

  /**
   * @description The App URL that we should forward our routes to
   */
  getUrl(){
    return this.url;
  }

}

module.exports = RouteModule;