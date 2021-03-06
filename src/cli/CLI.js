#!/usr/bin/env node
const minimist = require("minimist");
const Table = require("cli-table3");
const colors = require("colors");

// Utils
const { getShortHash, configAwareFetcher } = require("../util");

// Specific Commands
const listApps = require("./commands/listApps");
const loadApp = require("./commands/loadApp");
const reloadApp = require("./commands/reloadApp");
const unloadApp = require("./commands/unloadApp");
const enableApp = require("./commands/enableApp");
const disableApp = require("./commands/disableApp");
const listModules = require("./commands/listModules");
const enableModule = require("./commands/enableModule");
const disableModule = require("./commands/disableModule");
const listTasks = require("./commands/listTasks");

const {
  Config,
  EnvConfigLoader,
  StandardInstance,
  LoggerFactory,
  Logger,
  App
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
    --help, -h                    Show this usage
    -v                            Increment the logging verbosity
    --instance, -i   <url>        Specify the instance URL to run commands against
    --filter <property>=<value>   If output is an array of objects filter based on this property        
    --quiet, -q                   Quiet mode ( useful for chaining commands )

  Examples
    $ ${name} run                                             Start new instance
    $ ${name} env                                             Output config ( merged from all sources ) 
    $ ${name} ls                                          List all loaded Apps
    $ ${name} load [--permission <permission>] <url>      Load a single App from its URL and optionally grant a permission
    $ ${name} reload [--permission <permission>] <appId>  Reload an existing App Optionally granting a new Permission
    $ ${name} unload <appId>                              Unload (delete) a single App by its ID
    $ ${name} enable <appId>                              Enable a single app by its ID
    $ ${name} disable <appId>                             Disable a single app by its ID
    $ ${name} mod ls                                          List all Modules of Loaded Apps
    $ ${name} mod enable <modId>                              Enable a single module by its ID
    $ ${name} mod disable <modId>                             Disable a single module by its ID
    $ ${name} task ls                                         List the instance Task queue
  
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
        const row = [
          app.name,
          getShortHash(app.id),
          app.key,
          enabled,
          app.permission
        ];
        table.push(row);
      });
      return table.toString();
    },
    modules: modules => {
      const table = new Table({
        head: ["Module", "Id", "AppId", "Enabled", "Type"],
        style: {
          colWidths: [50, , , ,],
          head: []
        }
      });
      modules.forEach(module => {
        let enabled = module.enabled ? colors.green(true) : colors.red(false);
        const row = [
          module.name,
          getShortHash(module.id),
          getShortHash(module.appId),
          enabled,
          module.type
        ];
        table.push(row);
      });
      return table.toString();
    },
    tasks: tasks => {
      const table = new Table({
        head: ["Task", "Type", "Status"],
        style: {
          colWidths: [50, ,],
          head: []
        }
      });
      allTasks = [].concat(...Object.values(tasks));
      allTasks.forEach(task => {
        const row = [task.id, task.type, task.status];
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
        output += getShortHash(app.id) + "\n";
      });
      return output.trimRight();
    },
    modules: modules => {
      let output = "";
      modules.forEach(module => {
        output += getShortHash(module.id) + "\n";
      });
      return output.trimRight();
    },
    tasks: tasks => {
      let output = "";
      tasks.forEach(task => {
        output += task.id + "\n";
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
    fetcher = configAwareFetcher(config),
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
        let passedLogLevel = this.args.v.length - 1;
        // Max LogLevel can be 5
        passedLogLevel = passedLogLevel <= 5 ? passedLogLevel : 5;
        this.logLevel = getLogLevel(passedLogLevel);
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
      // dockui ls [--filter property=val] [-q]
      // List all Apps
      if (this.args._[2] === "ls") {
        listApps({
          baseUrl: this.remoteInstanceURL,
          fetcher: this.fetcher,
          screen: this.screen,
          formatters: this.formatters,
          logger: this.logger
        });
      }

      // dockui load [--permission <permission>] <url>
      if (this.args._[2] === "load") {
        if (!this.args._[3]) {
          this.screen.log("Missing argument <url>\n");
          return resolve(showUsage(this));
        }
        loadApp({
          baseUrl: this.remoteInstanceURL,
          fetcher: this.fetcher,
          screen: this.screen,
          logger: this.logger,
          url: this.args._[3],
          permission: this.args.permission || App.permissions.DEFAULT
        });
      }
      // dockui reload [--permission <permission>] <appId>
      if (this.args._[2] === "reload") {
        if (!this.args._[3]) {
          this.screen.log("Missing argument <appId>\n");
          return resolve(showUsage(this));
        }
        this.args._.splice(3).forEach(appId => {
          reloadApp({
            baseUrl: this.remoteInstanceURL,
            fetcher: this.fetcher,
            screen: this.screen,
            logger: this.logger,
            appId: appId,
            permission: this.args.permission
          });
        });
      }
      // dockui unload <appId>
      if (this.args._[2] === "unload") {
        if (!this.args._[3]) {
          this.screen.log("Missing argument <appId>\n");
          return resolve(showUsage(this));
        }
        this.args._.splice(3).forEach(appId => {
          unloadApp({
            baseUrl: this.remoteInstanceURL,
            fetcher: this.fetcher,
            screen: this.screen,
            logger: this.logger,
            appId: appId
          });
        });
      }
      // dockui enable <appId>..<n>
      if (this.args._[2] === "enable") {
        if (!this.args._[3]) {
          this.screen.log("Missing argument <appId>\n");
          return resolve(showUsage(this));
        }
        // For each arg from 3 on enable it
        this.args._.splice(3).forEach(appId => {
          enableApp({
            baseUrl: this.remoteInstanceURL,
            fetcher: this.fetcher,
            screen: this.screen,
            logger: this.logger,
            appId: appId
          });
        });
      }
      // dockui disable <appId>
      if (this.args._[2] === "disable") {
        if (!this.args._[3]) {
          this.screen.log("Missing argument <appId>\n");
          return resolve(showUsage(this));
        }
        this.args._.splice(3).forEach(appId => {
          disableApp({
            baseUrl: this.remoteInstanceURL,
            fetcher: this.fetcher,
            screen: this.screen,
            logger: this.logger,
            appId: appId
          });
        });
      }
      // dockui mod ls [--filter property=val] [-q]
      if (this.args._[2] === "mod") {
        // dockui disable <appId>
        if (this.args._[3] === "ls") {
          listModules({
            baseUrl: this.remoteInstanceURL,
            fetcher: this.fetcher,
            screen: this.screen,
            formatters: this.formatters,
            logger: this.logger
          });
        }
        // dockui mod enable <modId>
        if (this.args._[3] === "enable") {
          if (!this.args._[4]) {
            this.screen.log("Missing argument <moduleId>\n");
            return resolve(showUsage(this));
          }
          this.args._.splice(4).forEach(moduleId => {
            enableModule({
              baseUrl: this.remoteInstanceURL,
              fetcher: this.fetcher,
              screen: this.screen,
              logger: this.logger,
              moduleId: moduleId
            });
          });
        }
        // dockui mod disable <modId>
        if (this.args._[3] === "disable") {
          if (!this.args._[4]) {
            this.screen.log("Missing argument <moduleId>\n");
            return resolve(showUsage(this));
          }
          this.args._.splice(4).forEach(moduleId => {
            disableModule({
              baseUrl: this.remoteInstanceURL,
              fetcher: this.fetcher,
              screen: this.screen,
              logger: this.logger,
              moduleId: moduleId
            });
          });
        }
      }
      // dockui task ls [--filter property=val] [-q]
      if (this.args._[2] === "task") {
        if (this.args._[3] === "ls") {
          listTasks({
            baseUrl: this.remoteInstanceURL,
            fetcher: this.fetcher,
            screen: this.screen,
            formatters: this.formatters,
            logger: this.logger
          });
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
      console.log("Unknown Error Launching the CLI: ", e);
    }
  }
})();

module.exports = CLI;
