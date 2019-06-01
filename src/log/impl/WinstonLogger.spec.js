const WinstonLogger = require("./WinstonLogger");
const { Config } = require("../../config/Config");
const Logger = require("../Logger");
let config = null;

describe("WinstonLogger", function() {
  "use strict";

  beforeEach(function() {
    config = new Config();
    config.set("logging.transports", "console,file");
  });

  test("should be defined and loadable", function() {
    expect(WinstonLogger).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof WinstonLogger).toBe("function");
  });

  test("Should return an instance of Logger", function() {
    var logger = new WinstonLogger();
    expect(logger).toBeInstanceOf(Logger);
  });

  test("Should have correct signature", function() {
    var logger = new WinstonLogger();
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
    const logger = new WinstonLogger({ config });
    const config2 = new Config();
    config2.set("testKey2", "modified");
    const loggerChild = logger.child({ config: config2 });
    expect(loggerChild.config.getAll()).toEqual(
      Object.assign(config.getAll(), config2.getAll())
    );
  });

  test("Should be able to log info, warn, error,verbose,debug,silly messages", function() {
    const old = console.error;
    console.error = jest.fn().mockImplementation();
    const logger = new WinstonLogger({ config });
    logger._logger.clear();
    const infoSpy = jest.spyOn(logger._logger, "info");
    const warnSpy = jest.spyOn(logger._logger, "warn");
    const errorSpy = jest.spyOn(logger._logger, "error");
    const verboseSpy = jest.spyOn(logger._logger, "verbose");
    const debugSpy = jest.spyOn(logger._logger, "debug");
    const sillySpy = jest.spyOn(logger._logger, "silly");
    logger.info("some %o", "stuff", {}, [], "and", "some things");
    logger.error("some %s", "stuff", { and: "whatnot" });
    logger.warn("some warn %s", "stuff", { and: "tings" });
    logger.verbose("some %o", "stuff", {}, [], "and", "some things");
    logger.debug("some %s", "stuff", { and: "whatnot" });
    logger.silly("some warn %s", "stuff", { and: "tings" });
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(verboseSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(sillySpy).toHaveBeenCalledTimes(1);
    console.error = old;
  });
});
