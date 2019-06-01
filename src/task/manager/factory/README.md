# TaskManagerFactory

> Factory that returns a specific implementation of a TaskManager based on the Passed in Config

## Example

```javascript
// no config - returns defaults
const taskManager = TaskManagerFactory.create();

// with config
config = Config.builder()
  .withDefaults(DEFAULT_CONFIG)
  .withConfigLoader(new EnvConfigLoader())
  .withConfigLoader(new YamlConfigLoader())
  .build();
const taskManager = TaskManagerFactory.create(config);
```
