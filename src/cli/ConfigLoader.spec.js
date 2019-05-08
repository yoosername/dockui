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

  test("should provide static loadConfig method", function() {
    var configLoader1 = new ConfigLoader();
    configLoader1.load = jest.fn(() => {
      return {
        store: "store1",
        port: "port1",
        secret: "secret1"
      };
    });

    var configLoader2 = new ConfigLoader();
    configLoader2.load = jest.fn(() => {
      return {
        store: "store2",
        port: "port2"
      };
    });

    var config = ConfigLoader.loadConfig({}, [configLoader1, configLoader2]);
    expect(typeof config).toBe("object");
    expect(config.store).toBe("store2");
    expect(config.port).toBe("port2");
    expect(config.secret).toBe("secret1");
  });
});
