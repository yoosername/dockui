const {
  WebResourceModuleLoader,
  WebPageModuleLoader,
  WebItemModuleLoader,
  WebhookModuleLoader,
  WebFragmentModuleLoader,
  RouteModuleLoader,
  CachableModuleLoader,
  AuthorizationProviderModuleLoader,
  AuthenticationProviderModuleLoader,
  ApiModuleLoader,
  StoreFactory,
  TaskManagerFactory,
  InstanceBuilder
} = require("..");

const DEFAULT_CONFIG = {
  store: "memory",
  port: 5000,
  secret: "changeme"
};

/**
 * @description Generate a default Instance of DockUI based on Config choices
 * @return {DockUIInstance} An instance of DockUI
 */
const generateStandardInstance = () => {
  let config = null;
  let store = null;
  let taskManager = null;
  let appService = null;
  let webService = null;
  let appLoader = null;
  let instance = null;

  // Load config
  config = Config.builder()
    .withDefaults(DEFAULT_CONFIG)
    .withConfigLoader(new EnvConfigLoader())
    .withConfigLoader(new YamlConfigLoader())
    .build();

  // Load correct implementations of required services
  store = StoreFactory.create(config);
  taskManager = TaskManagerFactory.create(config);
  appService = AppServiceFactory.create(config);
  webService = WebServiceFactory.create(config);

  // Get an AppLoader with the ModuleLoaders we want etc
  appLoader = new AppLoader()
    .withConfig(config)
    .withModuleLoader(new WebResourceModuleLoader(config))
    .withModuleLoader(new WebPageModuleLoader(config))
    .withModuleLoader(new WebItemModuleLoader(config))
    .withModuleLoader(new WebhookModuleLoader(config))
    .withModuleLoader(new WebFragmentModuleLoader(config))
    .withModuleLoader(new RouteModuleLoader(config))
    .withModuleLoader(new CachableModuleLoader(config))
    .withModuleLoader(new AuthorizationProviderModuleLoader(config))
    .withModuleLoader(new AuthenticationProviderModuleLoader(config))
    .withModuleLoader(new ApiModuleLoader(config))
    .build();

  instance = new InstanceBuilder()
    .withStore(store)
    .withTaskManager(taskManager)
    .withTaskWorkers([new AppLoadWorker(taskManager, store, appLoader, config)])
    .withReactors([
      new DockerEventReactor(taskManager, config),
      new FileSystemReactor(taskManager, config)
    ])
    .withAppService(appService)
    .withWebService(webService)
    .build();

  return instance;
};

var singletonInstance = singletonInstance
  ? singletonInstance
  : generateStandardInstance();

module.exports = singletonInstance;
