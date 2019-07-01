#!/usr/bin/env node

const minimist = require("minimist");
const request = require("request-promise-native");
const Table = require("cli-table3");
const colors = require("colors");

const defaultFetcher = async options => {
  let data = {};
  try {
    data = await request(options);
  } catch (e) {
    throw new Error(
      `Error fetching Descriptor with options(${options}) Error: ${e}`
    );
  }
  return data;
};

const {
  Config,
  EnvConfigLoader,
  StandardInstance,
  LoggerFactory,
  Logger
} = require("../..");

const LOG_LEVEL_CONFIG_KEY = "logging.level";
const DEFAULT_LOG_LEVEL = "info";
const INSTANCE_URL_CONFIG_KEY = "instance";
const DEFAULT_INSTANCE_URL = "http://localhost:8080";

const showUsage = ({
  name = "CLI.js",
  logLevel = "info",
  screen = console,
  remoteInstanceURL = DEFAULT_INSTANCE_URL
}) => {
  screen.log(`
  Usage
    $ ${name} <cmd>

  Options
    --help, -h  Show this usage
    -v  Increment the logging verbosity
    -i  Running instance to run commands against

  Examples
    $ ${name} run                             Start new instance
    $ ${name} env                             Output config ( merged from all sources ) 
    $ ${name} app ls                          List all loaded Apps
    $ ${name} app load <url> <permission>     Load a single App from its URL and optionally grant a permission
  
  Info
    Log Level:  ${logLevel}
    Instance:  ${remoteInstanceURL}
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

const getDefaultFormatters = () => {
  return {
    apps: apps => {
      const table = new Table({
        head: ["App", "Id", "Key", "Enabled", "Permission"],
        style: {
          head: []
        }
        //colWidths: [200, 100, 100, 100, 100, 100]
      });
      apps.forEach(app => {
        let enabled = app.enabled ? colors.green(true) : colors.red(false);
        const row = [app.name, app.id, app.key, enabled, app.permission];
        table.push(row);
      });
      return table.toString();
    }
  };
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
    formatters = getDefaultFormatters(),
    fetcher = defaultFetcher,
    logger = LoggerFactory.create(config)
  } = {}) {
    this.name = name;
    this.fetcher = fetcher;
    this.formatters = formatters;
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
    const remoteInstanceURL = config.get(INSTANCE_URL_CONFIG_KEY);
    this.remoteInstanceURL = remoteInstanceURL
      ? remoteInstanceURL
      : DEFAULT_INSTANCE_URL;
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
          string: ["v", "instance", "i"]
        });
      } catch (err) {
        return reject(err);
      }

      // Set the instance
      if (this.args.instance) {
        this.remoteInstanceURL = this.args.instance;
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

      // App commands
      if (this.args._[2] === "app") {
        // List all Apps
        if (this.args._[3] === "ls") {
          try {
            const uri = this.remoteInstanceURL + "/api/v1/admin/app";
            const allApps = await this.fetcher({
              uri,
              method: "GET",
              json: true
            });
            if (allApps && allApps.length && allApps.length > 0) {
              if (
                this.formatters.apps &&
                typeof this.formatters.apps === "function"
              ) {
                this.screen.log(this.formatters.apps(allApps));
              }
            } else {
              this.screen.log("");
            }
          } catch (err) {
            this.logger.error("Error fetching apps, error = %o", err);
          }
        }
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
