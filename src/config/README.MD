# Configuration

> Helpers for Getting DockUI Configuration

## Config

> Encapsulates an immutable DockUI Instance configuration

```javascript
const config = new Config();
config.set("test", "testVal");
```

## Config.builder

> Helps with the loading of Config from one or more ConfigLoaders

```javascript
const config = Config.builder()
  .withConfigLoader(new ENVConfigLoader())
  .withConfigLoader(new YamlConfigLoader())
  .build();
```

## ConfigLoader

> Classes which extend ConfigLoader load Config data from a given source ( e.g. YAML FIle, or ENV Variables )

```javascript
const configEnvLoader = new ConfigEnvLoader();
const config = configEnvLoader.load();
```
