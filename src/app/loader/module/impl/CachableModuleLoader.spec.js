const CachableModuleLoader = require("./CachableModuleLoader");

describe("CachableModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(CachableModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof CachableModuleLoader).toBe("function");
    expect(() => {
      new CachableModuleLoader();
    }).not.toThrow();
    expect(new CachableModuleLoader()).toBeInstanceOf(CachableModuleLoader);
  });

  test("should return from the cache the same as you put into it", function() {
    const loader = new CachableModuleLoader();
    const descriptor = {
      type: "fakeDescriptor",
      url: "/some/url",
      name: "name",
      key: "key"
    };
    const state = {
      loaded: true,
      descriptor: descriptor,
      module: {}
    };
    loader.setCache(descriptor, state);
    var cachedState = loader.getCache(descriptor);
    expect(cachedState).toBe(state);
  });
});
