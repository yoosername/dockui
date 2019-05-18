const AuthorizationProviderModule = require("./AuthorizationProviderModule");

describe("AuthorizationProviderModule", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(AuthorizationProviderModule).not.toBeUndefined();
    expect(typeof AuthorizationProviderModule).toBe("function");
  });

  test("should have correct signature", function() {
    const module = new AuthorizationProviderModule();
    // From Module
    expect(typeof module.getId).toBe("function");
    expect(typeof module.getKey).toBe("function");
    // From AuthorizationProviderModule
    expect(typeof module.getUrl).toBe("function");
    expect(typeof module.getWeight).toBe("function");
  });
});
