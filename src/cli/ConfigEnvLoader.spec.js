const ConfigEnvLoader = require("./ConfigEnvLoader");
var configEnvLoader;

const ConfigDefaults = require("./ConfigDefaults");

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
  test("should be able to set the store", function() {
    let config = configEnvLoader.load();
    expect(config.store).toBe(ConfigDefaults.STORE);
    process.env.DOCKUI_STORE = "redis:server.net:1234";
    config = configEnvLoader.load();
    expect(config.store).toBe("redis:server.net:1234");
    delete process.env.DOCKUI_STORE;
  });

  // events
  test("should be able to set the events", function() {
    let config = configEnvLoader.load();
    expect(config.events).toBe(ConfigDefaults.EVENTS);
    process.env.DOCKUI_EVENTS = "rabbitmq::9200/bla";
    config = configEnvLoader.load();
    expect(config.events).toBe("rabbitmq::9200/bla");
    delete process.env.DOCKUI_EVENTS;
  });

  // port
  test("should be able to set the port", function() {
    let config = configEnvLoader.load();
    expect(config.port).toBe(ConfigDefaults.PORT);
    process.env.DOCKUI_PORT = "9000";
    config = configEnvLoader.load();
    expect(config.port).toBe("9000");
    delete process.env.DOCKUI_PORT;
  });

  // secret
  test("should be able to set the global secret", function() {
    let config = configEnvLoader.load();
    expect(config.secret).toBe(ConfigDefaults.SECRET);
    process.env.DOCKUI_SECRET = "changeme";
    config = configEnvLoader.load();
    expect(config.secret).toBe("changeme");
    delete process.env.DOCKUI_SECRET;
  });
});
