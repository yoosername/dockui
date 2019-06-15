#!/usr/bin/env node

const minimist = require("minimist");
const {
  Config,
  EnvConfigLoader,
  StandardInstance,
  LoggerFactory,
  Logger
} = require("../..");

const LOG_LEVEL_CONFIG_KEY = "logging.level";
const DEFAULT_LOG_LEVEL = "info";

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
    $ ${name} run           Start instance
    $ ${name} env           Output config ( merged from all sources ) 
    $ ${name} app
  
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
 * @description Helper to output runtime settings
 */
const logEnvironment = ({ config, screen }) => {
  const all = config.toEnv("dockui");
  for (var item in all) {
    screen.log(item + "=" + all[item]);
  }
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
    config = new Config(),
    screen = console,
    logger = LoggerFactory.create(config)
  } = {}) {
    this.name = name;
    this.config = config
      ? config
      : Config.builder()
          .withConfigLoader(new EnvConfigLoader())
          .build();
    this.screen = screen;
    this.logger = logger;
    const configLogLevel = config.get(LOG_LEVEL_CONFIG_KEY);
    this.logLevel = configLogLevel ? configLogLevel : DEFAULT_LOG_LEVEL;
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
      // Add defined logLevel to config for rest of system to use
      this.logger.setLogLevel(
        this.logLevel ? this.logLevel : DEFAULT_LOG_LEVEL
      );

      // user specified --help, show usage
      if (this.args && this.args.help) {
        return resolve(showUsage(this));
      }

      // No cmd args were specified, show usage
      if (this.args._ && this.args._.length === 2) {
        return resolve(showUsage(this));
      }

      // Env Command
      if (this.args._[2] === "env") {
        try {
          logEnvironment(this);
        } catch (err) {
          return reject(err);
        }
        return resolve();
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
        .withConfigLoader(new EnvConfigLoader())
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
