const RouteModuleLoader = require("./RouteModuleLoader");
const Module = require("../../../module/Module");
const RouteModule = require("../../../module/impl/RouteModule");
const ModuleLoader = require("../ModuleLoader");

describe("RouteModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(RouteModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof RouteModuleLoader).toBe("function");
    expect(() => {
      new RouteModuleLoader();
    }).not.toThrow();
    expect(new RouteModuleLoader()).toBeInstanceOf(ModuleLoader);
  });

  test("should load an instance of Module & RouteModule with correct signature", async () => {
    const loader = new RouteModuleLoader();
    expect(typeof loader.canLoadModuleDescriptor).toBe("function");
    expect(typeof loader.loadModuleFromDescriptor).toBe("function");
    const canLoad = loader.canLoadModuleDescriptor({
      type: RouteModule.DESCRIPTOR_TYPE
    });
    expect(canLoad).toEqual(true);
    const routes = [{ from: "/", to: "/test" }];
    const module = await loader.loadModuleFromDescriptor({
      type: RouteModule.DESCRIPTOR_TYPE,
      routes: routes
    });
    expect(module.getRoutes()).toEqual(routes);
    expect(module instanceof Module).toEqual(true);
    expect(module instanceof RouteModule).toEqual(true);
  });
});
