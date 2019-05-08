var { Config, ConfigBuilder } = require("./Config");

describe("Config", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(Config).not.toBeUndefined();
    expect(ConfigBuilder).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof Config).toBe("function");
    expect(typeof ConfigBuilder).toBe("function");
  });

  test("Should return a Config.Builder if one isnt passed as arg", function() {
    var builder = new Config();
    expect(builder).toBeInstanceOf(ConfigBuilder);
  });

  describe("ConfigBuilder", function() {
    // store
    test("should be able to set the store", function() {
      const config = new ConfigBuilder().withStore("file://local.file").build();
      expect(config.store).toBe("file://local.file");
    });

    // events
    test("should be able to set the events", function() {
      const config = new ConfigBuilder().withEvents("memory").build();
      expect(config.events).toBe("memory");
    });

    // port
    test("should be able to set the port", function() {
      const config = new ConfigBuilder().withPort("8000").build();
      expect(config.port).toBe("8000");
    });

    // secret
    test("should be able to set the global secret", function() {
      const config = new ConfigBuilder().withSecret("changeme").build();
      expect(config.secret).toBe("changeme");
    });
  });
});
