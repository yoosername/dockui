#!/usr/bin/env node

const minimist = require("minimist");
const { defaultConfig, generateDefaultInstance } = require("../Defaults");
const ConfigLoader = require("./ConfigLoader");
const LOG_LEVELS = ["info", "warn", "error", "debug"];

const showUsage = ({
  name = "cli.js",
  logger = console,
  logLevel = "info"
}) => {
  logger.log(`
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

/**
 * the CLI allows simpler management of DockUI instances from the Commandline
 */
class CLI {
  /**
   * @description Initialize the CLI
   */
  constructor({
    name = "cli.js",
    dockui = null,
    config = defaultConfig,
    configLoaders = [],
    logger = console
  } = {}) {
    this.name = name;
    this.config = config;
    this.logger = logger;
    this.dockui = dockui ? dockui : generateDefaultInstance(this.config);
    if (configLoaders.length) {
      var loadedConfig = ConfigLoader.loadConfig(this.config, configLoaders);
      this.config = loadedConfig;
    }
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
      if (this.args.v && this.args.v.length > 0) {
        this.logLevel = LOG_LEVELS[this.args.v.length - 1];
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
        await this.dockui.start();
        return resolve();
      }

      resolve(arguments);
    });
  }
}

// Allow this module to be run directly as a main module
if (typeof require != "undefined" && require.main === module) {
  new CLI({ name: "dockui" }).parse(process.argv);
}

module.exports = CLI;
