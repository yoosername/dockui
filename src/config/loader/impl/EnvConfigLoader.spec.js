const EnvConfigLoader = require("./EnvConfigLoader");

let envConfigLoader;

describe("EnvConfigLoader", function() {
  "use strict";

  beforeEach(function() {
    envConfigLoader = new EnvConfigLoader();
  });

  test("should be defined and loadable", function() {
    expect(EnvConfigLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof EnvConfigLoader).toBe("function");
  });

  // store
  test("should get the correct store type from ENV", function() {
    process.env.DOCKUI_STORE_TYPE = "memory";
    let config = envConfigLoader.load();
    expect(config.get("store.type")).toBe("memory");
  });

  test("should get the correct web port from ENV", function() {
    process.env.DOCKUI_WEB_PORT = "3333";
    let config = envConfigLoader.load();
    expect(config.get("web.port")).toBe("3333");
  });
});
