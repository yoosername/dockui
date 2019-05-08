const WebResourceModuleLoader = require("./app/loader/module/impl/WebResourceModuleLoader");
const WebPageModuleLoader = require("./app/loader/module/impl/WebPageModuleLoader");
const WebItemModuleLoader = require("./app/loader/module/impl/WebItemModuleLoader");
const WebhookModuleLoader = require("./app/loader/module/impl/WebhookModuleLoader");
const WebFragmentModuleLoader = require("./app/loader/module/impl/WebFragmentModuleLoader");
const RouteModuleLoader = require("./app/loader/module/impl/RouteModuleLoader");
const CachableModuleLoader = require("./app/loader/module/impl/CachableModuleLoader");
const AuthorizationProviderModuleLoader = require("./app/loader/module/impl/AuthorizationProviderModuleLoader");
const AuthenticationProviderModuleLoader = require("./app/loader/module/impl/AuthenticationProviderModuleLoader");
const ApiModuleLoader = require("./app/loader/module/impl/ApiModuleLoader");

const InMemoryAppStore = require("./store/impl/InMemoryAppStore");
const DefaultAppService = require("./app/service/impl/DefaultAppService");
const DefaultWebService = require("./web/impl/DefaultWebService");

const { DockUIApps } = require("./DockUIApps");

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

const defaultConfig = {
  store: "memory",
  port: 5000,
  secret: "changeme"
};

const generateInstance = config => {
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

module.exports = {
  generateInstance,
  defaultConfig
};
