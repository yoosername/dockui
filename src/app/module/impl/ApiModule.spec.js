const ApiModule = require("./ApiModule");

describe("ApiModule", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(ApiModule).not.toBeUndefined();
    expect(typeof ApiModule).toBe("function");
  });

  test("should have correct signature", function() {
    const module = new ApiModule();
    // From Module
    expect(typeof module.getId).toBe("function");
    expect(typeof module.getKey).toBe("function");
    // From ApiModule
    expect(typeof module.getUrl).toBe("function");
    expect(typeof module.getVersion).toBe("function");
  });
});
