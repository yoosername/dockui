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
  SimpleAppService,
  SimpleWebService,
  InstanceBuilder
} = require("../..");

const DEFAULT_CONFIG = {
  store: "memory",
  port: 5000,
  secret: "changeme"
};

/**
 * @description Generate a default Instance of DockUI based on Config choices
 * @return {DockUIInstance} An instance of DockUI
 */
const generateInstance = () => {
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
    .withModuleLoader(new WebResourceModuleLoader())
    .withModuleLoader(new WebPageModuleLoader())
    .withModuleLoader(new WebItemModuleLoader())
    .withModuleLoader(new WebhookModuleLoader())
    .withModuleLoader(new WebFragmentModuleLoader())
    .withModuleLoader(new RouteModuleLoader())
    .withModuleLoader(new CachableModuleLoader())
    .withModuleLoader(new AuthorizationProviderModuleLoader())
    .withModuleLoader(new AuthenticationProviderModuleLoader())
    .withModuleLoader(new ApiModuleLoader())
    .build();

  instance = new InstanceBuilder()
    .withStore(store)
    .withTaskManager(taskManager)
    .withTaskWorkers([new AppLoadWorker(taskManager, store, appLoader)])
    .withReactors([
      new DockerEventReactor(taskManager, "/var/docker.sock"),
      new FileSystemReactor(taskManager, "~/dockui/plugins")
    ])
    .withAppService(appService)
    .withWebService(webService)
    .build();

  return instance;
};

var singletonInstance = singletonInstance
  ? singletonInstance
  : generateInstance();

module.exports = singletonInstance;
