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
  AppServiceFactory,
  WebServiceFactory,
  InstanceBuilder
} = require("..");

/**
 * @description Generate an Instance of DockUI based on standard defaults
 * @return {Instance} An instance of DockUI
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
    .withConfigLoader(new EnvConfigLoader())
    //.withConfigLoader(new YamlConfigLoader())
    .build();

  // Load correct implementations of required services
  store = StoreFactory.create(config);
  taskManager = TaskManagerFactory.create(config);
  appService = AppServiceFactory.create(config);
  webService = WebServiceFactory.create(config);

  // Configure an AppLoader with a standard set of ModuleLoaders
  // The AppLoader is used by workers to actually fetch and process an App
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

  // configure a DockUI instance using our preffered settings
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

let singletonInstance;
singletonInstance = singletonInstance
  ? singletonInstance
  : generateStandardInstance();

module.exports = singletonInstance;
