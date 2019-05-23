const { Config } = require("../config/Config");

/**
 * A Logger encapsulates the ability to log data via some formatting to some receiver
 */
class Logger {
  /**
   * @argument {Object} config instance of Config() or raw config data
   * @returns {Logger} logger instance
   */
  constructor(config = new Config()) {
    if (config instanceof Config) {
      this.config = config;
    }
    if (typeof config === "object" && Object.keys(config).length) {
      this.config = new Config().load(config);
    }
  }

  /**
   * @description Log a single entry
   * @argument {Object} info Logging information (const {msg, level, ...meta} = info)
   */
  log(info) {
    // NoOp
  }

  /**
   * @description Shorthand method for logging logs of level error
   * @argument {...Object} msg arguments forming the message
   */
  error(msg) {
    // child classes should implement this feature
  }

  /**
   * @description Shorthand method for logging logs of level warn
   * @argument {...Object} msg arguments forming the message
   */
  warn(msg) {
    // child classes should implement this feature
  }

  /**
   * @description Shorthand method for logging logs of level info
   * @argument {...Object} msg arguments forming the message
   */
  info(msg) {
    // child classes should implement this feature
  }

  /**
   * @description Shorthand method for logging logs of level verbose
   * @argument {...Object} msg arguments forming the message
   */
  verbose(msg) {
    // child classes should implement this feature
  }

  /**
   * @description Shorthand method for logging logs of level debug
   * @argument {...Object} msg arguments forming the message
   */
  debug(msg) {
    // child classes should implement this feature
  }

  /**
   * @description Shorthand method for logging logs of level trace
   * @argument {...Object} msg arguments forming the message
   */
  silly(msg) {
    // child classes should implement this feature
  }

  /**
   * @description Create a new logger which overrides certain data
   * @argument {...Object} overrides data to override
   */
  child(config) {
    const newConfig = this.config.clone().load(config);
    return new Logger(newConfig);
  }
}

module.exports = Logger;
