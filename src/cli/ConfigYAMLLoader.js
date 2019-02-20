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

        if (doc.version) {
          config.withVersion(doc.version);
        }

        if (doc.default) {
          config.withDefaultInstance(doc.default);
        }

        if (
          doc.instances &&
          typeof doc.instances === "object" &&
          Object.keys(doc.instances).length > 0
        ) {
          var keys = Object.keys(doc.instances);

          for (var i = 0; i < keys.length; i++) {
            var instanceKey = keys[i];
            var instanceDoc = doc.instances[instanceKey];
            var instanceConfig = new InstanceConfig();

            if (instanceDoc.name) {
              instanceConfig.withName(instanceDoc.name);
            }

            if (instanceDoc.uuid) {
              instanceConfig.withUUID(instanceDoc.uuid);
            }

            if (instanceDoc.description) {
              instanceConfig.withDescription(instanceDoc.description);
            }

            if (
              instanceDoc.management &&
              instanceDoc.management.api &&
              instanceDoc.management.api.socket &&
              instanceDoc.management.api.socket.path
            ) {
              instanceConfig.withSocket(instanceDoc.management.api.socket.path);
            }

            if (
              instanceDoc.management &&
              instanceDoc.management.api &&
              instanceDoc.management.api.http &&
              instanceDoc.management.api.http.port
            ) {
              instanceConfig.withPort(instanceDoc.management.api.http.port);
            }

            if (
              instanceDoc.management &&
              instanceDoc.management.api &&
              instanceDoc.management.api.creds &&
              instanceDoc.management.api.creds.user &&
              instanceDoc.management.api.creds.password
            ) {
              instanceConfig.withCreds(
                instanceDoc.management.api.creds.user,
                instanceDoc.management.api.creds.password
              );
            }

            config.withInstance(instanceKey, instanceConfig.build());
          }
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
