const ConfigEnvLoader = require("./ConfigEnvLoader");

let configEnvLoader;

describe("ConfigEnvLoader", function() {
  "use strict";

  beforeEach(function() {
    configEnvLoader = new ConfigEnvLoader();
  });

  test("should be defined and loadable", function() {
    expect(ConfigEnvLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof ConfigEnvLoader).toBe("function");
  });

  // store
  test("should get the correct store type from ENV", function() {
    process.env.DOCKUI_STORE_TYPE = "memory";
    let config = configEnvLoader.load();
    expect(config.get("store.type")).toBe("memory");
  });

  test("should get the correct web port from ENV", function() {
    process.env.DOCKUI_WEB_PORT = "3333";
    let config = configEnvLoader.load();
    expect(config.get("web.port")).toBe("3333");
  });
});
