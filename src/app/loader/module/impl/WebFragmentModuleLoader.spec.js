const WebFragmentModuleLoader = require("./WebFragmentModuleLoader");
const Module = require("../../../module/Module");
const WebFragmentModule = require("../../../module/impl/WebFragmentModule");
const ModuleLoader = require("../ModuleLoader");

describe("WebFragmentModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(WebFragmentModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof WebFragmentModuleLoader).toBe("function");
    expect(() => {
      new WebFragmentModuleLoader();
    }).not.toThrow();
    expect(new WebFragmentModuleLoader()).toBeInstanceOf(ModuleLoader);
  });

  test("should load an instance of Module & WebFragmentModule with correct signature", async () => {
    const loader = new WebFragmentModuleLoader();
    expect(typeof loader.canLoadModuleDescriptor).toBe("function");
    expect(typeof loader.loadModuleFromDescriptor).toBe("function");
    const canLoad = loader.canLoadModuleDescriptor({
      type: WebFragmentModule.DESCRIPTOR_TYPE
    });
    expect(canLoad).toEqual(true);
    const module = await loader.loadModuleFromDescriptor({
      type: WebFragmentModule.DESCRIPTOR_TYPE,
      url: "fakeURL"
    });
    expect(module.getUrl()).toEqual("fakeURL");
    expect(module instanceof Module).toEqual(true);
    expect(module instanceof WebFragmentModule).toEqual(true);
  });
});
