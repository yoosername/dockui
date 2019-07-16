const ConfigLoader = require("../ConfigLoader");
const { Config } = require("../../Config");

/**
 * Loads Config from Environment into a Config object
 */
class EnvConfigLoader extends ConfigLoader {
  constructor() {
    super();
    // Load any ENV vars from .env into process.env to make it easier
    // to load defaults
  }

  /**
   * Loads all ENV vars from a common root ( defaults to DOCKUI )
   * @returns {Config} The processed Config
   */
  load() {
    const config = new Config();
    const prefix = "DOCKUI_";
    for (var key in process.env) {
      if (key.startsWith(prefix)) {
        const propKey = key
          .replace(prefix, "")
          .split("_")
          .join(".")
          .toLowerCase();
        config.set(propKey, process.env[key]);
      }
    }
    // config.set("store.type", process.env.DOCKUI_STORE_TYPE);
    // config.set("web.type", process.env.DOCKUI_WEB_TYPE);
    // config.set("web.scheme", process.env.DOCKUI_WEB_SCHEME);
    // config.set("web.port", process.env.DOCKUI_WEB_PORT);
    // config.set("web.ssl.cert", process.env.DOCKUI_WEB_SSL_CERT);
    // config.set("web.ssl.key", process.env.DOCKUI_WEB_SSL_KEY);
    // config.set("taskmanager.type", process.env.DOCKUI_TASKMANAGER_TYPE);
    // config.set("appservice.type", process.env.DOCKUI_APPSERVICE_TYPE);
    return config;
  }
}

module.exports = EnvConfigLoader;
