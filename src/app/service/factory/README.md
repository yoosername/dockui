# AppServiceFactory

> Factory that returns a specific implementation of a AppService based on the Passed in Config

## Example

```javascript
// no config - returns defaults
const appService = AppServiceFactory.create();

// with config
config = Config.builder()
  .withDefaults(DEFAULT_CONFIG)
  .withConfigLoader(new EnvConfigLoader())
  .withConfigLoader(new YamlConfigLoader())
  .build();
const appService = AppServiceFactory.create(config);
```
