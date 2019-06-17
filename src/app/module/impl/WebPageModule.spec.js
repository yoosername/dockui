const WebPageModule = require("./WebPageModule");

describe("WebPageModule", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(WebPageModule).not.toBeUndefined();
    expect(typeof WebPageModule).toBe("function");
  });

  test("should have correct signature", function() {
    const module = new WebPageModule();
    // From Module
    expect(typeof module.getId).toBe("function");
    expect(typeof module.getKey).toBe("function");
    // From WebPage
    expect(typeof module.getUrl).toBe("function");
    expect(typeof module.getDecorator).toBe("function");
  });
});
