var ModuleLoader = require("./ModuleLoader");

describe("ModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(ModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof ModuleLoader).toBe("function");
    expect(() => {
      new ModuleLoader();
    }).not.toThrow();
    expect(new ModuleLoader()).toBeInstanceOf(ModuleLoader);
  });

  test("should log a warning if you dont extend the default behaviour", function() {
    console.warn = jest.fn(warn => {});
    const loader = new ModuleLoader();
    expect(typeof loader.canLoadModuleDescriptor).toBe("function");
    expect(typeof loader.loadModuleFromDescriptor).toBe("function");
    loader.canLoadModuleDescriptor();
    expect(console.warn).toHaveBeenCalledTimes(1);
    loader.loadModuleFromDescriptor();
    expect(console.warn).toHaveBeenCalledTimes(2);
    console.warn.mockClear();
  });
});
