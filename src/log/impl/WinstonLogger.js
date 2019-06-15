const { Config } = require("../../config/Config");
const Logger = require("../Logger");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, splat, simple, printf, colorize } = format;

const DEFAULT_LOG_LEVEL = "info";

const upperCaseLevel = printf((info, opts) => {
  info.level = info.level.toUpperCase();
  return info;
});
const dockuiLogFormat = printf(
  ({ level, message, service, timestamp, ...rest }) => {
    return `[${timestamp}][${service}][${level}] : ${message}`;
  }
);
/**
 * A {Logger} which is backed by Winston
 */
class WinstonLogger extends Logger {
  /**
   * @argument {Object} config instance of Config() or raw config data
   * @returns {Logger} logger instance
   */
  constructor({ config = new Config(), parent = null } = {}) {
    super(...arguments);
    this.config = config;
    const configLogLevel = config.get("log.level");
    this.logLevel = configLogLevel ? configLogLevel : DEFAULT_LOG_LEVEL;
    this.parent = parent;
    this.children = [];
    const loggerServiceName = this.config.get("service.name") || "main";
    // If we have a parent then get a winston child logger instead.
    try {
      this._transports = {
        console: new transports.Console({ level: this.logLevel })
      };
      this._transportArray = Object.values(this._transports);
      this._logger = createLogger({
        level: this.logLevel,
        format: combine(
          timestamp(),
          upperCaseLevel,
          splat(),
          simple(),
          colorize({ all: false }),
          dockuiLogFormat
        ),
        defaultMeta: { service: loggerServiceName },
        transports: this._transportArray
      });
    } catch (err) {
      console.log(
        "There was an error configuring logging for service [%s]",
        loggerServiceName,
        err
      );
    }
  }

  /**
   * @description Log a single entry
   * @argument {Object} info Logging information (const {msg, level, ...meta} = info)
   */
  log(...msg) {
    this._logger.log(...msg);
  }

  /**
   * @description Shorthand method for logging logs of level error
   * @argument {...Object} msg arguments forming the message
   */
  error(...msg) {
    this._logger.error(...msg);
  }

  /**
   * @description Shorthand method for logging logs of level warn
   * @argument {...Object} msg arguments forming the message
   */
  warn(...msg) {
    this._logger.warn(...msg);
  }

  /**
   * @description Shorthand method for logging logs of level info
   * @argument {...Object} msg arguments forming the message
   */
  info(...msg) {
    this._logger.info(...msg);
  }

  /**
   * @description Shorthand method for logging logs of level verbose
   * @argument {...Object} msg arguments forming the message
   */
  verbose(...msg) {
    this._logger.verbose(...msg);
  }

  /**
   * @description Shorthand method for logging logs of level debug
   * @argument {...Object} msg arguments forming the message
   */
  debug(...msg) {
    this._logger.debug(...msg);
  }

  /**
   * @description Shorthand method for logging logs of level trace
   * @argument {...Object} msg arguments forming the message
   */
  silly(...msg) {
    this._logger.silly(...msg);
  }

  /**
   * @description Get current logLevel
   * @returns {String} current loglevel
   */
  getLogLevel() {
    return this.logLevel;
  }

  /**
   * @description Reconfigure a loglevel at runtime
   * @argument {String} level The level to set the logger to
   */
  setLogLevel(level) {
    this.logLevel = level;
    this._logger.level = level;
    this._transports.console.level = level;
    if (this.children && this.children.length > 0) {
      this.children.forEach(child => {
        child.setLogLevel(level);
      });
    }
  }

  /**
   * @description Create a new logger which overrides certain data
   * @argument {...Object} overrides data to override
   */
  child({ config = new Config() } = {}) {
    const newConfig = this.config.clone().load(config);
    const child = new WinstonLogger({ config: newConfig, parent: this });
    this.children.push(child);
    return child;
  }
}

module.exports = WinstonLogger;
