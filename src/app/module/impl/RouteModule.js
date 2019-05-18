const Module = require("../Module");

/**
 * @description Represents an Route Module.
 */
class RouteModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null, routes = [] } = {}) {
    super(arguments);
    this.url = url;
    this.routes = routes;
  }

  /**
   * @description The list of routes to forward to the URL
   */
  getRoutes() {
    return this.routes;
  }

  /**
   * @description The App URL that we should forward our routes to
   */
  getUrl() {
    return this.url;
  }
}

RouteModule.DESCRIPTOR_TYPE = "Route";

module.exports = RouteModule;
