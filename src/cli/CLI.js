#!/usr/bin/env node

const minimist = require("minimist");
const { DockUIApps } = require("../DockUIApps");
const LOG_LEVELS = ["info", "warn", "error", "debug"];

const DEFAULT_STORE = "memory";
const DEFAULT_EVENTS = "memory";
const DEFAULT_PORT = 8080;
const DEFAULT_SECRET = "changeme";

const InMemoryAppStore = require("../store/impl/InMemoryAppStore");
const InMemoryEventService = require("../events/impl/InMemoryEventService");
const DefaultLifecycleEventsStrategy = require("../events/strategy/impl/DefaultLifecycleEventsStrategy");

const WebResourceModuleLoader = require("../app/loader/module/impl/WebResourceModuleLoader");
const WebPageModuleLoader = require("../app/loader/module/impl/WebPageModuleLoader");
const WebItemModuleLoader = require("../app/loader/module/impl/WebItemModuleLoader");
const WebhookModuleLoader = require("../app/loader/module/impl/WebhookModuleLoader");
const WebFragmentModuleLoader = require("../app/loader/module/impl/WebFragmentModuleLoader");
const RouteModuleLoader = require("../app/loader/module/impl/RouteModuleLoader");
const CachableModuleLoader = require("../app/loader/module/impl/CachableModuleLoader");
const AuthorizationProviderModuleLoader = require("../app/loader/module/impl/AuthorizationProviderModuleLoader");
const AuthenticationProviderModuleLoader = require("../app/loader/module/impl/AuthenticationProviderModuleLoader");
const ApiModuleLoader = require("../app/loader/module/impl/ApiModuleLoader");

const DockerAppLoader = require("../app/loader/impl/DockerAppLoader");
const GitAppLoader = require("../app/loader/impl/GitAppLoader");
const FileAppLoader = require("../app/loader/impl/FileAppLoader");
const UrlAppLoader = require("../app/loader/impl/UrlAppLoader");

const DefaultAppService = require("../app/service/impl/DefaultAppService");
const DefaultWebService = require("../web/impl/DefaultWebService");

const showUsage = ({ name = "cli.js", logger, logLevel = "info" }) => {
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

const StoreFactory = type => {
  switch (type) {
    case "memory":
      return InMemoryAppStore;
    default:
      return InMemoryAppStore;
  }
};

const EventServiceFactory = type => {
  switch (type) {
    case "memory":
      return InMemoryEventService;
    default:
      return InMemoryEventService;
  }
};

const defaultDockUIApps = config => {
  let Store = null;
  let store = null;
  let EventService = null;
  let eventService = null;
  let lifecycleEventsStrategy = null;
  let moduleLoaders = null;
  let appLoaders = null;
  let appService = null;
  let webService = null;
  let dockUIApps = null;

  try {
    Store = StoreFactory(config.store);
    store = new Store();
    EventService = EventServiceFactory(config.events);
    eventService = new EventService();
    lifecycleEventsStrategy = new DefaultLifecycleEventsStrategy(
      eventService,
      store
    );
    moduleLoaders = [
      new WebResourceModuleLoader(),
      new WebPageModuleLoader(),
      new WebItemModuleLoader(),
      new WebhookModuleLoader(),
      new WebFragmentModuleLoader(),
      new RouteModuleLoader(),
      new CachableModuleLoader(),
      new AuthorizationProviderModuleLoader(),
      new AuthenticationProviderModuleLoader(),
      new ApiModuleLoader()
    ];
    appLoaders = [
      new DockerAppLoader(store, moduleLoaders, eventService),
      new GitAppLoader(store, moduleLoaders, eventService),
      new FileAppLoader(store, moduleLoaders, eventService),
      new UrlAppLoader(store, moduleLoaders, eventService)
    ];
    appService = new DefaultAppService(
      appLoaders,
      store,
      lifecycleEventsStrategy,
      eventService
    );
    webService = new DefaultWebService(appService, eventService);
    dockUIApps = new DockUIApps()
      .withStore(store)
      .withEventService(eventService)
      .withAppService(appService)
      .withWebService(webService)
      .build();
  } catch (err) {
    console.error(err);
  }
  // Get a Webservice running on selected PORT.

  return dockUIApps;
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
  constructor({
    name = "cli.js",
    dockui = null,
    config = {
      store: DEFAULT_STORE,
      events: DEFAULT_EVENTS,
      port: DEFAULT_PORT,
      secret: DEFAULT_SECRET
    },
    configLoaders = [],
    logger = console
  } = {}) {
    this.name = name;
    this.config = config;
    this.logger = logger;
    configLoaders.length && loadConfig(this.config, configLoaders);

    this.dockui = dockui ? dockui : defaultDockUIApps(this.config);
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
