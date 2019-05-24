const Logger = require("./Logger");
const { Config } = require("../config/Config");
let config = null;

describe("Config", function() {
  "use strict";

  beforeEach(function() {
    config = new Config();
    config.set("logging.transports", "console,file");
  });

  test("should be defined and loadable", function() {
    expect(Logger).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof Logger).toBe("function");
  });

  test("Should return an instance of Logger", function() {
    var logger = new Logger();
    expect(logger).toBeInstanceOf(Logger);
  });

  test("Should have correct signature", function() {
    var logger = new Logger();
    expect(typeof logger.log).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.verbose).toBe("function");
    expect(typeof logger.silly).toBe("function");
  });

  test("Should be able to get a child logger with overridden config", function() {
    const config = new Config();
    config.set("testKey", "testVal");
    config.set("testKey2", "testVal2");
    const logger = new Logger({ config });
    const config2 = new Config();
    config2.set("testKey2", "modified");
    const loggerChild = logger.child({ config: config2 });
    expect(loggerChild.config.getAll()).toEqual(
      Object.assign(config.getAll(), config2.getAll())
    );
  });
});
