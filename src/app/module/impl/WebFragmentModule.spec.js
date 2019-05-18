const WebFragmentModule = require("./WebFragmentModule");

describe("WebFragmentModule", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(WebFragmentModule).not.toBeUndefined();
    expect(typeof WebFragmentModule).toBe("function");
  });

  test("should have correct signature", function() {
    const module = new WebFragmentModule();
    // From Module
    expect(typeof module.getId).toBe("function");
    expect(typeof module.getKey).toBe("function");
    // From Webhook
    expect(typeof module.getUrl).toBe("function");
    expect(typeof module.getSelector).toBe("function");
    expect(typeof module.getLocation).toBe("function");
    expect(typeof module.getWeight).toBe("function");
  });
});
