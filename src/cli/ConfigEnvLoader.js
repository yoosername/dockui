const fs = require("fs");
const ConfigLoader = require("./ConfigLoader");
const { Config } = require("./Config");
const ConfigDefaults = require("./ConfigDefaults");

/**
 * Loads Config from Environment into a Config object
 */
class ConfigEnvLoader extends ConfigLoader {
  constructor() {
    super();
  }

  /**
   * Loads a resource from ENV vars
   * @returns {Config} The processed Config
   */
  load() {
    return new Config()
      .withStore(process.env.DOCKUI_STORE || ConfigDefaults.STORE)
      .withEvents(process.env.DOCKUI_EVENTS || ConfigDefaults.EVENTS)
      .withPort(process.env.DOCKUI_PORT || ConfigDefaults.PORT)
      .withSecret(process.env.DOCKUI_SECRET || ConfigDefaults.SECRET)
      .build();
  }
}

module.exports = ConfigEnvLoader;
