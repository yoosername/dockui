const WebResourceModuleLoader = require("./app/loader/module/impl/WebResourceModuleLoader");
const WebPageModuleLoader = require("./app/loader/module/impl/WebPageModuleLoader");
const WebItemModuleLoader = require("./app/loader/module/impl/WebItemModuleLoader");
const WebhookModuleLoader = require("./app/loader/module/impl/WebhookModuleLoader");
const WebFragmentModuleLoader = require("./app/loader/module/impl/WebFragmentModuleLoader");
const RouteModuleLoader = require("./app/loader/module/impl/RouteModuleLoader");
const AuthorizationProviderModuleLoader = require("./app/loader/module/impl/AuthorizationProviderModuleLoader");
const AuthenticationProviderModuleLoader = require("./app/loader/module/impl/AuthenticationProviderModuleLoader");
const ApiModuleLoader = require("./app/loader/module/impl/ApiModuleLoader");
const StoreFactory = require("./store/factory/StoreFactory");
const TaskManagerFactory = require("./task/manager/factory/TaskManagerFactory");
const AppServiceFactory = require("./app/service/factory/AppServiceFactory");
const WebServiceFactory = require("./web/factory/WebServiceFactory");
const AppLoader = require("./app/loader/AppLoader");
const AppLoadWorker = require("./task/worker/impl/AppLoadWorker");
const AppStateWorker = require("./task/worker/impl/AppStateWorker");
const { Instance } = require("./Instance");
const { Config } = require("./config/Config");
const ConfigEnvLoader = require("./config/loader/impl/ConfigEnvLoader");
const LoggerFactory = require("./log/factory/LoggerFactory");

/**
 * @description Generate an Instance of DockUI based on standard defaults
 * @return {Instance} An instance of DockUI
 */
const generateStandardInstance = cnf => {
  let config = null;
  let logger = null;
  let store = null;
  let taskManager = null;
  let appService = null;
  let webService = null;
  let appLoader = null;
  let instance = null;

  // Use a simple context for passing our services around
  const context = {};

  // Load config if wasnt passed in
  if (!cnf) {
    context.config = Config.builder()
      .withConfigLoader(new ConfigEnvLoader())
      //.withConfigLoader(new YamlConfigLoader())
      .build();
  } else {
    context.config = cnf;
  }

  // Get a Logger to use
  logger = context.logger = LoggerFactory.create(context);

  // Load correct implementations of required services
  context.store = StoreFactory.create(context);
  context.taskManager = TaskManagerFactory.create(context);
  context.appService = AppServiceFactory.create(context);
  context.webService = WebServiceFactory.create(context);

  // Configure an AppLoader with a standard set of ModuleLoaders
  // The AppLoader is used by workers to actually fetch and process an App
  context.appLoader = new AppLoader()
    .withConfig(config)
    .withModuleLoader(new WebResourceModuleLoader(context))
    .withModuleLoader(new WebPageModuleLoader(context))
    .withModuleLoader(new WebItemModuleLoader(context))
    .withModuleLoader(new WebhookModuleLoader(context))
    .withModuleLoader(new WebFragmentModuleLoader(context))
    .withModuleLoader(new RouteModuleLoader(context))
    .withModuleLoader(new AuthorizationProviderModuleLoader(context))
    .withModuleLoader(new AuthenticationProviderModuleLoader(context))
    .withModuleLoader(new ApiModuleLoader(context))
    .build();

  // configure a DockUI instance using our preferred settings
  instance = new Instance()
    .withStore(context.store)
    .withTaskManager(context.taskManager)
    .withTaskWorkers([new AppLoadWorker(context), new AppStateWorker(context)])
    //.withReactors([new DockerEventsReactor(taskManager, config)])
    .withAppService(context.appService)
    .withWebService(context.webService)
    .build();

  return instance;
};

module.exports = generateStandardInstance;
