# AppLoader

> An AppLoader is used by the AppService to load Apps from a specific place (e.g. Config, DB, Docker, Public Microservice Url, Github, AWS Lambda).

* There can be many Loaders called by the AppService.
* AppLoaders should be designed to operate against a single type of App

## API

### scanForNewApps()

Start looking for new Apps and load them when discovered. Maintain an internal Map. Use Events to share Loaded / Unloaded events.

Doesnt overwrite state of already loaded Apps.

### stopScanningForNewApps()

Stop looking for new Apps but dont unload existing ones.

### getApps(filter)

Return a list of all the Apps that have been loaded by this loader.

### getApp(key)

Convenience method for getApps with a filter. Does the same thing as

```getApps(app => app.getKey() === key);```

### enableApp(key)

Convenience method for enabling an App loaded by this Loader. Does the same thing as

```getApps(app => app.getKey() === key).enable();```

### disableApp

Convenience method for disabling an App loaded by this Loader. Does the same thing as

```getApps(app => app.getKey() === key).disable();```

### getModules(key, filter)

Convenience method for retrieving all of the modules in a given App. Does the same thing as

```getApps(app => app.getKey() === key).getModules(filter);```

### enableModule(appKey, moduleKey)

Convenience method for enabling a Module. Does the same thing as

```javascript
   getModules(appKey, module => module.getKey() === moduleKey).enable();
```

### disableModule

Convenience method for disabling a Module. Does the same thing as

```javascript
   getModules(appKey, module => module.getKey() === moduleKey).disable();
```