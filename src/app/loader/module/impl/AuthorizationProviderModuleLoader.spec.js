const AuthorizationProviderModuleLoader = require("./AuthorizationProviderModuleLoader");
const Module = require("../../../module/Module");
const AuthorizationProviderModule = require("../../../module/impl/AuthorizationProviderModule");
const ModuleLoader = require("../ModuleLoader");

describe("AuthorizationProviderModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(AuthorizationProviderModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof AuthorizationProviderModuleLoader).toBe("function");
    expect(() => {
      new AuthorizationProviderModuleLoader();
    }).not.toThrow();
    expect(new AuthorizationProviderModuleLoader()).toBeInstanceOf(
      ModuleLoader
    );
  });

  test("should load an instance of Module & RouteModule with correct signature", async () => {
    const loader = new AuthorizationProviderModuleLoader();
    expect(typeof loader.canLoadModuleDescriptor).toBe("function");
    expect(typeof loader.loadModuleFromDescriptor).toBe("function");
    const canLoad = loader.canLoadModuleDescriptor({
      type: AuthorizationProviderModule.DESCRIPTOR_TYPE
    });
    expect(canLoad).toEqual(true);
    const module = await loader.loadModuleFromDescriptor({
      type: AuthorizationProviderModule.DESCRIPTOR_TYPE,
      url: "fakeURL"
    });
    expect(module.getUrl()).toEqual("fakeURL");
    expect(module instanceof Module).toEqual(true);
    expect(module instanceof AuthorizationProviderModule).toEqual(true);
  });
});
