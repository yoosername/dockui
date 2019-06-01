var WebResourceModuleLoader = require("./WebResourceModuleLoader");
var Module = require("../../../module/Module");
var WebResourceModule = require("../../../module/impl/WebResourceModule");
var ModuleLoader = require("../ModuleLoader");

describe("WebResourceModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(WebResourceModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof WebResourceModuleLoader).toBe("function");
    expect(() => {
      new WebResourceModuleLoader();
    }).not.toThrow();
    expect(new WebResourceModuleLoader()).toBeInstanceOf(ModuleLoader);
  });

  test("should load an instance of Module & WebResourceModule with correct signature", async () => {
    const loader = new WebResourceModuleLoader();
    expect(typeof loader.canLoadModuleDescriptor).toBe("function");
    expect(typeof loader.loadModuleFromDescriptor).toBe("function");
    const canLoad = loader.canLoadModuleDescriptor({
      type: WebResourceModule.DESCRIPTOR_TYPE
    });
    expect(canLoad).toEqual(true);
    const module = await loader.loadModuleFromDescriptor({
      type: WebResourceModule.DESCRIPTOR_TYPE,
      url: "fakeURL"
    });
    expect(module.getUrl()).toEqual("fakeURL");
    expect(module instanceof Module).toEqual(true);
    expect(module instanceof WebResourceModule).toEqual(true);
  });
});
