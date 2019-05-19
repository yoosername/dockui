const {
  WebResourceModuleLoader,
  WebPageModuleLoader,
  WebItemModuleLoader,
  WebhookModuleLoader,
  WebFragmentModuleLoader,
  RouteModuleLoader,
  AuthorizationProviderModuleLoader,
  AuthenticationProviderModuleLoader,
  ApiModuleLoader,
  StoreFactory,
  TaskManagerFactory,
  AppServiceFactory,
  WebServiceFactory,
  AppLoader,
  AppLoadWorker,
  AppStateWorker,
  Instance,
  Config,
  ConfigEnvLoader
} = require("..");

/**
 * @description Generate an Instance of DockUI based on standard defaults
 * @return {Instance} An instance of DockUI
 */
const generateStandardInstance = cnf => {
  let config = null;
  let store = null;
  let taskManager = null;
  let appService = null;
  let webService = null;
  let appLoader = null;
  let instance = null;

  // Load config if wasnt passed in
  if (!cnf) {
    config = Config.builder()
      .withConfigLoader(new ConfigEnvLoader())
      //.withConfigLoader(new YamlConfigLoader())
      .build();
  } else {
    config = cnf;
  }

  // Load correct implementations of required services
  store = StoreFactory.create(config);
  taskManager = TaskManagerFactory.create(config);
  appService = AppServiceFactory.create(taskManager, store, config);
  webService = WebServiceFactory.create(appService, config);

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
    .withModuleLoader(new AuthorizationProviderModuleLoader(config))
    .withModuleLoader(new AuthenticationProviderModuleLoader(config))
    .withModuleLoader(new ApiModuleLoader(config))
    .build();

  // configure a DockUI instance using our preferred settings
  instance = new Instance()
    .withStore(store)
    .withTaskManager(taskManager)
    .withTaskWorkers([
      new AppLoadWorker(taskManager, store, appLoader, config),
      new AppStateWorker(taskManager, store, appLoader, config)
    ])
    //.withReactors([new DockerEventsReactor(taskManager, config)])
    .withAppService(appService)
    .withWebService(webService)
    .build();

  return instance;
};

module.exports = generateStandardInstance;
