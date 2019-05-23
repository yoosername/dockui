const WinstonLogger = require("../impl/WinstonLogger");
const { Config } = require("../../config/Config");

/**
 * @description LoggerFactory has a single method .create which generates
 *              a Store instance based on passed in Config
 */
class LoggerFactory {
  constructor() {}

  /**
   * @async
   * @description Return new Logger based on passed in config
   * @argument {Config} config The runtime config
   * @return {Store} A instance of a Logger
   */
  create(config = new Config()) {
    let logger = null;
    switch (config.get("logger.type")) {
      case "":
        logger = new WinstonLogger(config);
      default:
        logger = new WinstonLogger(config);
    }
    return logger;
  }
}
let factory;
factory = factory ? factory : new LoggerFactory();
module.exports = factory;
