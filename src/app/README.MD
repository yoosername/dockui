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

* [AppStore](../store/) (Persisting the state)
* [EventService](../events/) (Messaging and system Events)
* [LifeCycleEventStrategy](../events/) (Rules tying Lifecycle Events to Actions at runtime)
* [AppLoader](../app/loader/) (Handle Discovery, Parsing Descriptors and Loading AppModules by delegating to one or more AppModuleLoaders)
* [AppModuleLoader](../app/loader/) (Handle Parsing specific Module Descriptor and initialising the module. )
* [AppService](../app/service/) (Handle Loading Apps via delegation to one or more AppLoaders and Enabling, Disabling / storing state using provided store)
* [WebService](../web/) (Web Server and associated Middleware etc)
