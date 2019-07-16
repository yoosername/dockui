const Module = require("../Module");

/**
 * @description Represents an Route Module.
 */
class RouteModule extends Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({ url = null, routes = [], weight = "10" } = {}) {
    super(...arguments);
    this.type = RouteModule.DESCRIPTOR_TYPE;
    this.routes = routes;
    this.weight = weight;
  }

  /**
   * @description The list of routes to forward to the URL
   */
  getRoutes() {
    return this.routes;
  }

  /**
   * @description The weight determines the order that the WebFragment
   *              will be displayed starting at 0.
   */
  getWeight() {
    return this.weight;
  }

  /**
   * @description Helper to return a serialized version of this Module for storage/transport
   * @returns {JSON} A Pure JSON representation of the Module
   */
  toJSON() {
    const json = Object.assign(super.toJSON(), {
      url: this.url,
      routes: this.routes,
      weight: this.weight,
      type: this.type
    });
    return json;
  }
}

RouteModule.DESCRIPTOR_TYPE = "Route";

module.exports = RouteModule;
