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