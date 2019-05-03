# DockUI App API

## DockUIApps

> Wrapper to simplify initialisation of App system

### Example

```javascript
// context holds all the runtime info passed between services for a given instance.
// note: new DockUIApps() can be used as shorthand for new DockUIApps.ContextBuilder()
const context = new DockUIApps.ContextBuilder()
  .withConfig(config)
  .withStore(new StoreFactory())
  .withTaskManager(new TaskManagerFactory())
  .withModuleLoaders(new ModuleLoaderFactory())
  .withAppLoaders(new AppLoaderFactory())
  .withAppService(new DefaultAppService())
  .withWebService(new DefaultWebService())
  .withLifecycleEventsStrategy(new DefaultLifecycleEventsStrategy());

// Create new instance using the desired Config
dockUIApps = new DockUIApps(context);
// Start it
dockUIApps.start();
// Shut it down
dockUIApps.shutdown();
```
