const commander = require("commander");

/**
 * the CLI is a bundled utility to allow easy management of DockUI instances from the Commandline
 */
class CLI {
  /**
   * @description Starts the CLI
   */
  constructor(...loaders) {
    this.config = {};
    loaders.forEach(loader => {
      const loaderConfig = loader.load();
      this.config.store = loaderConfig.store
        ? loaderConfig.store
        : this.config.store;
      this.config.events = loaderConfig.events
        ? loaderConfig.events
        : this.config.events;
      this.config.port = loaderConfig.port
        ? loaderConfig.port
        : this.config.port;
      this.config.secret = loaderConfig.secret
        ? loaderConfig.secret
        : this.config.secret;
    });
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
      commander
        .arguments("<cmd>")
        .action(() => {
          resolve(arguments);
        })
        .on("--help", () => {
          resolve("--help");
        })
        .on("error", err => {
          reject(err);
        });

      commander.parse(args);
    });
  }
}

module.exports = CLI;
