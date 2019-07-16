const WebItemModuleLoader = require("./WebItemModuleLoader");
const Module = require("../../../module/Module");
const WebItemModule = require("../../../module/impl/WebItemModule");
const ModuleLoader = require("../ModuleLoader");

describe("WebItemModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(WebItemModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof WebItemModuleLoader).toBe("function");
    expect(() => {
      new WebItemModuleLoader();
    }).not.toThrow();
    expect(new WebItemModuleLoader()).toBeInstanceOf(ModuleLoader);
  });

  test("should load an instance of Module & WebItemModule with correct signature", async () => {
    const loader = new WebItemModuleLoader();
    expect(typeof loader.canLoadModuleDescriptor).toBe("function");
    expect(typeof loader.loadModuleFromDescriptor).toBe("function");
    const canLoad = loader.canLoadModuleDescriptor({
      type: WebItemModule.DESCRIPTOR_TYPE
    });
    expect(canLoad).toEqual(true);
    const module = await loader.loadModuleFromDescriptor({
      type: WebItemModule.DESCRIPTOR_TYPE,
      url: "fakeURL"
    });
    expect(module.getUrl()).toEqual("fakeURL");
    expect(module instanceof Module).toEqual(true);
    expect(module instanceof WebItemModule).toEqual(true);
  });
});
