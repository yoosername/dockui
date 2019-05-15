# DockUI InstanceBuilder API

## StandardInstance

> Default framework instance which uses Config + Defaults to build system

Note: For more flexibility use the InstanceBuilder directly

### Example

```javascript
const { StandardInstance } = require("./");
const instance = new StandardInstance();

// Start it
instance.start();
// Shut it down
instance.shutdown();
```

## InstanceBuilder

> Wrapper to simplify initialisation of App system

### Example

```javascript
// context holds all the runtime info passed between services for a given instance.
// note: new DockUIApps() can be used as shorthand for new DockUIApps.ContextBuilder()
instance = new InstanceBuilder()
  .withStore(store)
  .withTaskManager(taskManager)
  .withTaskWorkers([new AppLoadWorker(taskManager, store, appLoader)])
  .withReactors([
    new DockerEventReactor(taskManager, config),
    new FileSystemReactor(taskManager, config)
  ])
  .withAppService(appService)
  .withWebService(webService)
  .build();

// Start it
instance.start();
// Shut it down
instance.shutdown();
```
