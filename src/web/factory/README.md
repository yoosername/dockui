# WebServiceFactory

> Factory that returns a specific instance of a WebService based on the Passed in Config

## Example

```javascript
// no config - returns defaults
const webService = WebServiceFactory.create();

// with config
config = Config.builder()
  .withDefaults(DEFAULT_CONFIG)
  .withConfigLoader(new EnvConfigLoader())
  .withConfigLoader(new YamlConfigLoader())
  .build();
const webService = WebServiceFactory.create(config);
```
