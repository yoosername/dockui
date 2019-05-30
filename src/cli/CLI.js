#!/usr/bin/env node

const minimist = require("minimist");
const {
  Config,
  ConfigEnvLoader,
  StandardInstance,
  LoggerFactory,
  Logger
} = require("../..");

const showUsage = ({
  name = "CLI.js",
  logLevel = "info",
  screen = console
}) => {
  screen.log(`
  Usage
    $ ${name} <cmd>

  Options
    --help, -h  Show this usage
    --verbosity, -v  Increment the logging verbosity

  Examples
    $ ${name} run
    $ ${name} -vvv apps
  
  Info
    Log Level:  ${logLevel}
  `);
};

const getLogLevel = code => {
  const levels = Logger.levels;
  for (var level in levels) {
    if (levels[level] === code) {
      return level;
    }
  }
  return Logger.levels.error;
};

/**
 * the CLI allows simpler management of DockUI instances from the Commandline
 */
class CLI {
  /**
   * @description Initialize the CLI
   */
  constructor({
    name = "cli.js",
    instance = null,
    config = null,
    screen = console,
    logger = screen
  } = {}) {
    this.name = name;
    this.config = config
      ? config
      : Config.builder()
          .withConfigLoader(new ConfigEnvLoader())
          .build();
    this.screen = screen;
    this.logger = logger;
    this.instance = instance ? instance : StandardInstance(...arguments);
  }

  /**
   * @description Returns the current runtime config
   */
  getConfig() {
    return this.config;
  }

  /**
   * @description Processes the passed arguments
   */
  parse(args) {
    return new Promise(async (resolve, reject) => {
      try {
        this.args = minimist(args, {
          string: ["v"]
        });
      } catch (err) {
        return reject(err);
      }

      // Set LogLevel
      if (typeof this.args.v === "string") {
        this.logLevel = getLogLevel(0);
      }
      if (this.args.v instanceof Array && this.args.v.length > 0) {
        this.logLevel = getLogLevel(this.args.v.length - 1);
      }

      // user specified --help, show usage
      if (this.args && this.args.help) {
        return resolve(showUsage(this));
      }

      // No cmd args were specified, show usage
      if (this.args._ && this.args._.length === 2) {
        return resolve(showUsage(this));
      }

      // Run Command
      if (this.args._[2] === "run") {
        try {
          await this.instance.start();
        } catch (err) {
          return reject(err);
        }
        return resolve();
      }

      resolve(arguments);
    });
  }
}

/**
 * Allow this module to be run directly as a main module
 */
(async () => {
  if (typeof require != "undefined" && require.main === module) {
    try {
      const config = Config.builder()
        .withConfigLoader(new ConfigEnvLoader())
        .build();
      const logger = LoggerFactory.create(config);
      await new CLI({ name: "dockui", config, logger, screen: console }).parse(
        process.argv
      );
    } catch (e) {
      console.log(e);
    }
  }
})();

module.exports = CLI;
