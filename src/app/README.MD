# DockUI App API

## DockUIApps

  > Wrapper to simplify initialisation of App system

### Example

```javascript
const store = new InMemoryAppStore();
const eventService = new NativeEventService();
const lifecycleStrategy = new DefaultLifeCycleEventStrategy(eventService, store);
const moduleLoaders = [
  new RouteModuleLoader(),
  new AuthenticationModuleLoader(),
  new AuthorisationModuleLoader(),
  new WebItemModuleLoader(),
  new WebFragmentModuleLoader(),
  new WebPageModuleLoader(),
  new WebResourceModuleLoader(),
  new ApiModuleLoader(),
  new WebHookModuleLoader(),
];
const dockerEventsAppLoader = new DockerEventsAppLoader(moduleLoaders, eventService);
const webService = new ExpressWebService(eventService);
const appService = new DefaultAppService([dockerEventsAppLoader],store,lifecycleStrategy,eventService);

new DockUIApps.Builder()
  .withStore(store)
  .withEventService(eventService)
  .withAppService(appService)
  .withWebService(webService)
  .build()
.start()
```

## Required Services

* [AppStore](../store/) (Persisting the state)
* [EventService](../events/) (Messaging and system Events)
* [LifeCycleEventStrategy](../events/) (Rules tying Lifecycle Events to Actions at runtime)
* [AppLoader](../app/loader/) (Handle Discovery, Parsing Descriptors and Loading AppModules by delegating to one or more AppModuleLoaders)
* [ModuleLoader](../app/loader/) (Handle Parsing specific Module Descriptor and initialising the module. )
* [AppService](../app/service/) (Handle Loading Apps via delegation to one or more AppLoaders and Enabling, Disabling / storing state using provided store)
* [WebService](../web/) (Web Server and associated Middleware etc)

## App and Module definitions

For detailed information on App and Module configuration see: [Descriptor Reference](../../../src/app/dockui.app.yml)

### App

> An App is something which defines and provides one or more features to the overall system in the form of Modules.

* Apps can be Loaded, Unloaded, Enabled and Disabled.
* Apps provide Modules via an AppDescriptor

### Module

> See [Modules](module/)