# AppLoader

> An AppLoader is used by the AppService to load Apps from a specific place (e.g. DB, Docker, Public Microservice Url).

* There can be many Loaders called by the AppService.
* AppLoaders should be designed to operate against a single type of App

## API

### scanForNewApps

Start looking for new Apps and load them when discovered. Maintain an internal Map. Use Events to share Loaded / Unloaded events.

Doesnt overwrite state of already loaded Apps.

### stopScanningForNewApps

Stop looking for new Apps but dont unload existing ones.

### getApps

Return a list of all the Apps that have been loaded by this loader.

### enableApp

Hook called when the given App is enabled by the system. gives us a chance to notify the App, or perform some housekeeping.

### disableApp

Hook called when the given App is disabled by the system. gives us a chance to notify the App, or perform some housekeeping.

### getAppModules(app, filter)

Convenience method for retrieving all of the modules in a given App. Does the same thing as

```getApps(app).getAppModules(filter);```

### enableAppModule

Hook called when the given Module is enabled by the system. gives us a chance to notify the App / Module, or perform some housekeeping.

### disableAppModule

Hook called when the given Module is disabled by the system. gives us a chance to notify the App / Module, or perform some housekeeping.
