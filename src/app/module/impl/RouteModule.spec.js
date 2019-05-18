const RouteModule = require("./RouteModule");

describe("RouteModule", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(RouteModule).not.toBeUndefined();
    expect(typeof RouteModule).toBe("function");
  });

  test("should have correct signature", function() {
    const module = new RouteModule();
    // From Module
    expect(typeof module.getId).toBe("function");
    expect(typeof module.getKey).toBe("function");
    // From RouteModule
    expect(typeof module.getUrl).toBe("function");
    expect(typeof module.getRoutes).toBe("function");
  });
});
