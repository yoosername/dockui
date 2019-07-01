#!/usr/bin/env node

const minimist = require("minimist");
const request = require("request");
const Table = require("cli-table3");
const colors = require("colors");

const defaultFetcher = async options => {
  return new Promise(function(resolve, reject) {
    try {
      request(options, (err, response, body) => {
        if (err) return reject(err);
        resolve({ response, body });
      });
    } catch (err) {
      reject(err);
    }
  });
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
    --help, -h       Show this usage
    -v               Increment the logging verbosity
    --instance, -i   Running instance to run commands against
    --quiet, -q      Quiet mode

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

const getQuietFormatters = () => {
  return {
    apps: apps => {
      let output = "";
      apps.forEach(app => {
        output += app.id + "\n";
      });
      return output.trimRight();
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
    this.quiet = false;
  }

  /**
   * @description Returns the current runtime config
   */
  getConfig() {
    return this.config;
  }

  /**
   * @description Sets formatters to be quiet for all output
   */
  setQuietMode() {
    this.formatters = getQuietFormatters();
    this.quiet = true;
  }

  /**
   * @description Processes the passed arguments
   */
  parse(args) {
    return new Promise(async (resolve, reject) => {
      try {
        this.args = minimist(args, {
          string: ["v", "instance", "i"],
          boolean: ["quiet", "q"]
        });
      } catch (err) {
        return reject(err);
      }

      // Set whether to quiet all output
      if (this.args.quiet || this.args.q) {
        this.setQuietMode();
      }

      // Set the instance
      if (this.args.instance || this.args.i) {
        this.remoteInstanceURL = this.args.instance
          ? this.args.instance
          : this.args.i;
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
          const uri = this.remoteInstanceURL + "/api/v1/admin/app";
          try {
            const { response, body } = await this.fetcher({
              uri,
              method: "GET",
              json: true
            });
            if (!response.statusCode === 200) {
              this.logger.error(
                "There was an error calling the management Api(%s)",
                uri
              );
              this.logger.error(response.message);
              resolve();
            }
            if (body && body.length && body.length > 0) {
              if (
                this.formatters.apps &&
                typeof this.formatters.apps === "function"
              ) {
                this.screen.log(this.formatters.apps(body));
              }
            } else {
              this.screen.log("");
            }
          } catch (err) {
            this.logger.error("Error connecting to Management API (%s)", uri);
            this.logger.debug(err);
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
