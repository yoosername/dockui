const { Config } = require("../../config/Config");
const Logger = require("../Logger");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, splat, simple, printf, colorize } = format;

const upperCaseLevel = printf((info, opts) => {
  info.level = info.level.toUpperCase();
  const { level, message, service, timestamp, ...rest } = info;
  for (var item in message) {
    message[item] = JSON.stringify(message[item]);
  }
  return info;
});
const dockuiLogFormat = printf(
  ({ level, message, service, timestamp, ...rest }) => {
    return `[${timestamp}][${service}][${level}] : ${message} ${rest}`;
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
  constructor(config = new Config()) {
    super(config);
    if (config instanceof Config) {
      this.config = config;
    }
    if (typeof config === "object" && Object.keys(config).length) {
      this.config = new Config().load(config);
    }

    this._logger = createLogger({
      level: "info",
      format: combine(
        timestamp(),
        upperCaseLevel,
        splat(),
        simple(),
        colorize({ all: true }),
        dockuiLogFormat
      ),
      defaultMeta: { service: "main" },
      transports: [new transports.Console()]
    });
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
   * @description Create a new logger which overrides certain data
   * @argument {...Object} overrides data to override
   */
  child(config) {
    const newConfig = this.config.clone().load(config);
    return new Logger(newConfig);
  }
}

module.exports = WinstonLogger;
