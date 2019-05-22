const ConfigLoader = require("./ConfigLoader");

describe("ConfigLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(ConfigLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof ConfigLoader).toBe("function");
  });

  test("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = jest.spyOn(global.console, "warn").mockImplementation();
    const configLoader = new ConfigLoader();
    expect(typeof configLoader.load).toBe("function");
    configLoader.load();
    expect(console.warn).toBeCalled();
    logSpy.mockReset();
  });
});
