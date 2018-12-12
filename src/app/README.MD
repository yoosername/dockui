# DockUI App API

## DockUIApps

  > Wrapper to simplify initialisation of App system

### Example

```javascript
const store = new InMemoryAppStore();
const eventService = new NativeEventService();
const lifecycleStrategy = new DefaultLifeCycleEventStrategy(eventService, store);
const appModuleLoaders = [new DefaultAppModuleLoader(eventService)]
const dockerEventsAppLoader = new DockerEventsAppLoader(appModuleLoaders, eventService);
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

* [AppStore](../store/README.md) (Persisting the state)
* [EventService](../events/README.md) (Messaging and system Events)
* [LifeCycleEventStrategy](../events/README.md) (Rules tying Lifecycle Events to Actions at runtime)
* [AppLoader](../app/loader/README.md) (Handle Discovery, Parsing Descriptors and Loading AppModules by delegating to one or more AppModuleLoaders)
* [AppModuleLoader](../app/loader/README.md) (Handle Parsing specific Module Descriptor and initialising the module. )
* [AppService](../app/service/README.md) (Handle Loading Apps via delegation to one or more AppLoaders and Enabling, Disabling / storing state using provided store)
* [WebService](../web/README.md) (Web Server and associated Middleware etc)
