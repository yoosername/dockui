const ConfigFileLoader = require("./ConfigFileLoader");
const { Config, InstanceConfig } = require("./Config");

const yaml = require("js-yaml");

/**
 * Loads a YAML resource into a Config object
 */
class ConfigYAMLLoader extends ConfigFileLoader {
  /**
   * @argument the path to the YAML file
   */
  constructor(path) {
    super(path);
  }

  /**
   * Returns a Config file built from a parsed YAML file
   * @returns {Config} The processed Config
   */
  load() {
    var doc;
    var config;

    if (this.resource) {
      // Parse the YAML out of it
      try {
        doc = yaml.safeLoad(this.resource);
      } catch (e) {
        throw new Error("Could not load Config from YAML file, error: ", e);
      }

      // Try to build a Config File from the YAML generated Object
      if (doc && typeof doc === "object") {
        config = new Config();

        if (doc.store) {
          config.withStore(doc.store);
        }

        if (doc.events) {
          config.withEvents(doc.events);
        }

        if (doc.port) {
          config.withPort(doc.port);
        }

        if (doc.secret) {
          config.withSecret(doc.secret);
        }
      }
    } else {
      throw new Error(
        "Could not load Config, missing or corrupt Config file: ",
        this.path
      );
    }

    if (config && config.build) {
      return config.build();
    } else {
      throw new Error(
        "Could not Parse Config. YAML file exists and can be parsed but may be badly formed",
        this.path
      );
    }
  }
}

module.exports = ConfigYAMLLoader;
