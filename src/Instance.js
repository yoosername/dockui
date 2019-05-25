const Logger = require("./log/Logger");
const { Config } = require("./config/Config");

/**
 * @description Wrapper around various DockUI App services for easier usage
 */
class Instance {
  /**
   * @argument {InstanceBuilder} builder
   */
  constructor(builder) {
    if (!builder) {
      return new InstanceBuilder();
    }

    this.config = builder.config ? builder.config : new Config();
    this.logger = builder.logger ? builder.logger : new Logger(this.config);
    this.webService = builder.webService;
    this.appService = builder.appService;
    this.appStore = builder.appStore;
    this.taskManager = builder.taskManager;
    this.taskWorkers = builder.taskWorkers;
    this.reactors = builder.reactors;
  }

  /**
   * @description Initialize and start App service
   */
  async start() {
    // Add graceful shutdown hook
    const shutdown = () => {
      this.logger.log(
        "SIGTERM signal intercepted - attempting to gracefully shut down"
      );
      this.shutdown();
      process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    try {
      await this.appService.start();
      await this.taskManager.start();
      this.taskWorkers.forEach(async worker => {
        await worker.start();
      });
      await this.webService.start();
    } catch (e) {
      this.logger.error("Error starting DockUI : %o", err);
    }
  }

  /**
   * @description Shutdown App service
   */
  async shutdown() {
    try {
      // Shutdown in reverse order.
      await this.webService.shutdown();
      this.taskWorkers.forEach(async worker => {
        await worker.shutdown();
      });
      await this.taskManager.shutdown();
      await this.appService.shutdown();
    } catch (e) {
      this.logger.error("Error starting DockUI : %o", err);
    }
  }
}

/**
 * @description Builder that generates a DockUI instance
 */
class InstanceBuilder {
  constructor() {
    this.config = {};
    this.logger = null;
    this.appStore = null;
    this.taskManager = null;
    this.taskWorkers = [];
    this.reactors = [];
    this.webService = null;
    this.appService = null;
  }

  /**
   * @description Use the specified Config object
   * @argument {Config} config The Config to use
   */
  withConfig(config = new Config()) {
    this.config = config;
    return this;
  }

  /**
   * @description Use the specified Logger object
   * @argument {Logger} logger The Logger to use
   */
  withLogger(logger = new Logger()) {
    this.logger = logger;
    return this;
  }

  /**
   * @description Use the specified AppStore
   * @argument {AppStore} appStore The AppStore to use
   */
  withStore(appStore) {
    this.appStore = appStore;
    return this;
  }

  /**
   * @description Use the specified TaskManager
   * @argument {TaskManager} taskManager The TaskManager to use
   */
  withTaskManager(taskManager) {
    this.taskManager = taskManager;
    return this;
  }

  /**
   * @description Use the specified TaskWorkers
   * @argument {Array} taskWorkers The TaskWorkers to use
   */
  withTaskWorkers(taskWorkers) {
    this.taskWorkers = taskWorkers;
    return this;
  }

  /**
   * @description Use the specified Reactors
   * @argument {Array} reactors The Reactors to use
   */
  withReactors(reactors) {
    this.reactors = reactors;
    return this;
  }

  /**
   * @description Use the specified WebService
   * @argument {WebService} webService the WebService to use
   */
  withWebService(webService) {
    this.webService = webService;
    return this;
  }

  /**
   * @description Use the specified AppService
   * @argument {AppService} appService The AppService to use
   */
  withAppService(appService) {
    this.appService = appService;
    return this;
  }

  /**
   * @description Return a new DockUIApps instance using builder values
   * @returns {DockUIApps} instance of DockUIApps
   */
  build() {
    const instance = new Instance(this);
    return instance;
  }
}

module.exports = {
  Instance: Instance,
  InstanceBuilder: InstanceBuilder
};
