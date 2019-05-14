# DockUI InstanceBuilder API

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
    new DockerEventReactor(taskManager, "/var/docker.sock"),
    new FileSystemReactor(taskManager, "~/dockui/plugins")
  ])
  .withAppService(appService)
  .withWebService(webService)
  .build();

// Start it
instance.start();
// Shut it down
instance.shutdown();
```
