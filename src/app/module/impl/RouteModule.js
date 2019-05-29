const Module = require("../Module");

/**
 * @description Represents an Route Module.
 */
class RouteModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null, routes = [] } = {}) {
    super(...arguments);
    this.type = RouteModule.DESCRIPTOR_TYPE;
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

  /**
   * @description Helper to return a serialized version of this Module for storage/transport
   * @returns {JSON} A Pure JSON representation of the Module
   */
  toJSON() {
    const json = Object.assign(super.toJSON(), {
      url: this.url,
      routes: this.routes,
      type: this.type
    });
    return json;
  }
}

RouteModule.DESCRIPTOR_TYPE = "Route";

module.exports = RouteModule;
