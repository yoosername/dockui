var WebPageModuleLoader = require("./WebPageModuleLoader");
var Module = require("../../../module/Module");
var WebPageModule = require("../../../module/impl/WebPageModule");
var ModuleLoader = require("../ModuleLoader");

describe("WebPageModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(WebPageModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof WebPageModuleLoader).toBe("function");
    expect(() => {
      new WebPageModuleLoader();
    }).not.toThrow();
    expect(new WebPageModuleLoader()).toBeInstanceOf(ModuleLoader);
  });

  test("should load an instance of Module & WebResourceModule with correct signature", async () => {
    const loader = new WebPageModuleLoader();
    expect(typeof loader.canLoadModuleDescriptor).toBe("function");
    expect(typeof loader.loadModuleFromDescriptor).toBe("function");
    const canLoad = loader.canLoadModuleDescriptor({
      type: WebPageModule.DESCRIPTOR_TYPE
    });
    expect(canLoad).toEqual(true);
    const module = await loader.loadModuleFromDescriptor({
      type: WebPageModule.DESCRIPTOR_TYPE,
      url: "fakeURL"
    });
    expect(module.getUrl()).toEqual("fakeURL");
    expect(module instanceof Module).toEqual(true);
    expect(module instanceof WebPageModule).toEqual(true);
  });
});
