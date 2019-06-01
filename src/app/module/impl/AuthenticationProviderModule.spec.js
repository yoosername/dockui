const AuthenticationProviderModule = require("./AuthenticationProviderModule");

describe("AuthenticationProviderModule", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(AuthenticationProviderModule).not.toBeUndefined();
    expect(typeof AuthenticationProviderModule).toBe("function");
  });

  test("should have correct signature", function() {
    const module = new AuthenticationProviderModule();
    // From Module
    expect(typeof module.getId).toBe("function");
    expect(typeof module.getKey).toBe("function");
    // From AuthenticationProviderModule
    expect(typeof module.getUrl).toBe("function");
    expect(typeof module.getWeight).toBe("function");
  });
});
