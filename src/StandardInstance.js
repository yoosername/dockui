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
const AppUnLoadWorker = require("./task/worker/impl/AppUnLoadWorker");
const AppReloadWorker = require("./task/worker/impl/AppReloadWorker");
const AppStateWorker = require("./task/worker/impl/AppStateWorker");
const ModuleStateWorker = require("./task/worker/impl/ModuleStateWorker");
const { Instance } = require("./Instance");
const { Config } = require("./config/Config");
const EnvConfigLoader = require("./config/loader/impl/EnvConfigLoader");
const LoggerFactory = require("./log/factory/LoggerFactory");
const DockerEventsReactor = require("./task/reactor/impl/DockerEventsReactor");

/**
 * @description Generate an Instance of DockUI based on sensible defaults
 * @return {Instance} An instance of DockUI
 */
module.exports = generateStandardInstance = ({
  config = new Config(),
  logger = null
} = {}) => {
  let instance = null;

  // Use a simple context object for passing our services around
  const context = {};

  // Load config from ENV if wasnt passed in
  if (!config) {
    context.config = Config.builder()
      .withConfigLoader(new EnvConfigLoader())
      //.withConfigLoader(new YamlConfigLoader())
      .build();
  } else {
    context.config = config;
  }

  // Get a Logger to use if one wasnt passed in
  context.logger = logger !== null ? logger : LoggerFactory.create(context);

  // Load correct implementations of required services (created based on the config)
  context.store = StoreFactory.create(context);
  context.taskManager = TaskManagerFactory.create(context);
  context.appService = AppServiceFactory.create(context);
  context.webService = WebServiceFactory.create(context);

  // Configure an AppLoader with a common set of ModuleLoaders
  // The AppLoader is used by workers to actually fetch and process an App
  context.appLoader = new AppLoader()
    .withConfig(context.config)
    .withLogger(context.logger)
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

  instance = new Instance()
    .withConfig(context.config)
    .withStore(context.store)
    .withTaskManager(context.taskManager)
    .withTaskWorkers([
      new AppLoadWorker(context),
      new AppUnLoadWorker(context),
      new AppReloadWorker(context),
      new AppStateWorker(context),
      new ModuleStateWorker(context)
    ])
    .withReactors([new DockerEventsReactor(context)])
    .withAppService(context.appService)
    .withWebService(context.webService)
    .build();

  return instance;
};
