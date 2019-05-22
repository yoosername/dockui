# Config

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
