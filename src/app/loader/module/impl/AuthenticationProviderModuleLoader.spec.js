const AuthenticationProviderModuleLoader = require("./AuthenticationProviderModuleLoader");
const Module = require("../../../module/Module");
const AuthenticationProviderModule = require("../../../module/impl/AuthenticationProviderModule");
const ModuleLoader = require("../ModuleLoader");

describe("AuthenticationProviderModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(AuthenticationProviderModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof AuthenticationProviderModuleLoader).toBe("function");
    expect(() => {
      new AuthenticationProviderModuleLoader();
    }).not.toThrow();
    expect(new AuthenticationProviderModuleLoader()).toBeInstanceOf(
      ModuleLoader
    );
  });

  test("should load an instance of Module & RouteModule with correct signature", async () => {
    const loader = new AuthenticationProviderModuleLoader();
    expect(typeof loader.canLoadModuleDescriptor).toBe("function");
    expect(typeof loader.loadModuleFromDescriptor).toBe("function");
    const canLoad = loader.canLoadModuleDescriptor({
      type: AuthenticationProviderModule.DESCRIPTOR_TYPE
    });
    expect(canLoad).toEqual(true);
    const module = await loader.loadModuleFromDescriptor({
      type: AuthenticationProviderModule.DESCRIPTOR_TYPE,
      url: "fakeURL"
    });
    expect(module.getUrl()).toEqual("fakeURL");
    expect(module instanceof Module).toEqual(true);
    expect(module instanceof AuthenticationProviderModule).toEqual(true);
  });
});
