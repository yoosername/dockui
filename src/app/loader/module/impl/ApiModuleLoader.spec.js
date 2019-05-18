const ApiModuleLoader = require("./ApiModuleLoader");
const Module = require("../../../module/Module");
const ApiModule = require("../../../module/impl/ApiModule");
const ModuleLoader = require("../ModuleLoader");

describe("ApiModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(ApiModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof ApiModuleLoader).toBe("function");
    expect(() => {
      new ApiModuleLoader();
    }).not.toThrow();
    expect(new ApiModuleLoader()).toBeInstanceOf(ModuleLoader);
  });

  test("should load an instance of Module & RouteModule with correct signature", async () => {
    const loader = new ApiModuleLoader();
    expect(typeof loader.canLoadModuleDescriptor).toBe("function");
    expect(typeof loader.loadModuleFromDescriptor).toBe("function");
    const canLoad = loader.canLoadModuleDescriptor({
      type: ApiModule.DESCRIPTOR_TYPE
    });
    expect(canLoad).toEqual(true);
    const module = await loader.loadModuleFromDescriptor({
      type: ApiModule.DESCRIPTOR_TYPE,
      url: "fakeURL"
    });
    expect(module.getUrl()).toEqual("fakeURL");
    expect(module instanceof Module).toEqual(true);
    expect(module instanceof ApiModule).toEqual(true);
  });
});
