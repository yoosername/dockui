var ModuleDescriptor = require("./ModuleDescriptor");

describe("ModuleDescriptor", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(ModuleDescriptor).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof ModuleDescriptor).toBe("function");
  });

  test("should validate a an object with at least key type and name", function() {
    expect(() => {
      new ModuleDescriptor();
    }).toThrow();

    expect(() => {
      new ModuleDescriptor(null, null, null);
    }).toThrow();

    expect(() => {
      new ModuleDescriptor(undefined, "", false);
    }).toThrow();

    expect(() => {
      new ModuleDescriptor({
        key: "ModuleKey",
        url: "http://bla.bla"
      });
    }).toThrow();

    expect(() => {
      new ModuleDescriptor({
        key: "test.module",
        type: "vanilla",
        name: "test module"
      });
    }).not.toThrow();
  });

  // Methods to Test
});
