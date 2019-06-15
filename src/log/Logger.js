const { Config } = require("../config/Config");

/**
 * A Logger encapsulates the ability to log data via some formatting to some receiver
 */
class Logger {
  /**
   * @argument {Object} config instance of Config() or raw config data
   * @returns {Logger} logger instance
   */
  constructor({ config = new Config(), parent = null } = {}) {
    this.config = config;
    this.parent = parent;
  }

  /**
   * @description Returns this Loggers config
   * @return {Config} the config
   */
  getConfig() {
    return this.config;
  }

  /**
   * @description Returns this Loggers parent if there is one or null
   * @return {Logger} parent Logger or null
   */
  getParent() {
    return this.parent;
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
   * @description Get current logLevel
   * @returns {String} current loglevel
   */
  getLogLevel() {
    // child classes should implement this feature
  }

  /**
   * @description Reconfigure a loglevel at runtime
   * @argument {String} level The level to set the logger to
   */
  setLogLevel(level) {
    // child classes should implement this feature
  }

  /**
   * @description Create a new logger which overrides certain data
   * @argument {...Object} overrides data to override
   */
  child({ config = new Config() } = {}) {
    const newConfig = this.config.clone().load(config);
    return new Logger({ config: newConfig, parent: this });
  }
}

/**
 * @description The log levels we support
 * @static
 */
Logger.levels = Object.freeze({
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
});

module.exports = Logger;
