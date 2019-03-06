#!/usr/bin/env node

const minimist = require("minimist");

const showUsage = logger => {
  logger.log(`
    Usage: cli.js <cmd> [<options>]
    
    Commands: 
      apps

    Options: 
      --help    Show this help message
  `);
};

const loadConfig = (config, loaders) => {
  loaders.forEach(loader => {
    const loaderConfig = loader.load();
    config.store = loaderConfig.store ? loaderConfig.store : config.store;
    config.events = loaderConfig.events ? loaderConfig.events : config.events;
    config.port = loaderConfig.port ? loaderConfig.port : config.port;
    config.secret = loaderConfig.secret ? loaderConfig.secret : config.secret;
  });
};
/**
 * the CLI is a bundled utility to allow easy management of DockUI instances from the Commandline
 */
class CLI {
  /**
   * @description Starts the CLI
   */
  constructor({ configLoaders = [], logger = console } = {}) {
    this.config = {
      store: null,
      events: null,
      port: null,
      secret: null
    };
    this.logger = logger;
    configLoaders.length && loadConfig(this.config, configLoaders);
  }

  /**
   * @description Returns the current runtime config
   */
  getConfig() {
    return this.config;
  }

  /**
   * @description Processes the passed arguments
   *
   */
  parse(args) {
    return new Promise((resolve, reject) => {
      try {
        this.args = minimist(args);
      } catch (err) {
        return reject(err);
      }

      // user specified --help
      if (this.args && this.args.help) {
        showUsage(this.logger);
      }

      resolve(arguments);
    });
  }
}

// Allow this module to be run directly as a main module
if (typeof require != "undefined" && require.main === module) {
  new CLI().parse(process.argv);
}

module.exports = CLI;
