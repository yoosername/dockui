var { Config, ConfigBuilder } = require("./Config");

class TestLoader {
  load() {
    const config = new Config();
    config.set("loaderKey1", "loaderValue1");
    config.set("loaderKey2", "loaderValue2");
    return config;
  }
}

class TestLoader2 {
  load() {
    const config = new Config();
    config.set("loaderKey2", "replacedValue2");
    config.set("loaderKey20", "loaderValue20");
    return config;
  }
}

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

  test("Should return a Config.Builder via static method", function() {
    var builder = new Config();
    expect(builder).toBeInstanceOf(Config);
    builder = Config.builder();
    expect(builder).toBeInstanceOf(ConfigBuilder);
  });

  describe("ConfigBuilder", function() {
    // store
    test("should be able to manually configure data", function() {
      const config = new ConfigBuilder().build();
      config.set("test", "testVal");
      expect(config.get("test")).toBe("testVal");
    });

    // events
    test("should be able to get single config by key", function() {
      const config = new ConfigBuilder().build();
      config.set("key1", "val1");
      config.set("key2", "val2");
      config.set("key3", "val3");
      expect(config.get("key2")).toBe("val2");
    });

    // port
    test("should be able to get all config", function() {
      const config = new ConfigBuilder().build();
      config.set("web.port", "3333");
      config.set("key2", "val2");
      config.set("key3", "val3");
      expect(Object.keys(config.getAll()).length).toBe(3);
    });

    // secret
    test("should be able to set config via loaders with correct precedence", function() {
      const config = Config.builder()
        .withConfigLoader(new TestLoader())
        .build();
      expect(config.get("loaderKey1")).toEqual("loaderValue1");
      expect(config.get("loaderKey2")).toEqual("loaderValue2");
    });

    test("should be able to override config via subsequent loaders", function() {
      const config = Config.builder()
        .withConfigLoader(new TestLoader())
        .withConfigLoader(new TestLoader2())
        .build();
      expect(config.get("loaderKey1")).toEqual("loaderValue1");
      expect(config.get("loaderKey2")).toEqual("replacedValue2");
      expect(config.get("loaderKey20")).toEqual("loaderValue20");
    });

    test("should be able to override loaders with set", function() {
      const config = Config.builder()
        .withConfigLoader(new TestLoader())
        .withConfigLoader(new TestLoader2())
        .build();
      expect(Object.keys(config.getAll()).length).toEqual(3);
      expect(config.get("loaderKey2")).toEqual("replacedValue2");
      config.set("loaderKey2", "replacedAgain");
      expect(Object.keys(config.getAll()).length).toEqual(3);
      expect(config.get("loaderKey2")).toEqual("replacedAgain");
    });
  });
});
