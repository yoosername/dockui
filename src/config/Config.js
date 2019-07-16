/**
 * A Config encapsulates configuration information derived from one or more DockUI config sources
 */
class Config {
  /**
   * @returns {Config} config instance
   */
  constructor(builder) {
    // Dont have to use loaders if we want to set data manually
    this.data = {};

    // If there are loaders, then use them
    if (builder && builder.loaders) {
      builder.loaders.forEach(loader => {
        this.copy(loader.load());
      });
    }
  }

  /**
   * @description Static to retrieve a Config Builder
   * @returns {ConfigBuilder} config instance
   * @static
   */
  static builder() {
    return new ConfigBuilder();
  }

  /**
   * @description Get the value of a config item by its key or null
   * @argument {String} key The normalised key of the config setting
   * @returns {Object} value of passed in key from Config or null
   */
  get(key) {
    return this.data[key] ? this.data[key] : null;
  }

  /**
   * @description Retrieve all config entries
   * @argument {String} strFilter if specified then only entries starting with this strFilter will be returned
   * @returns {Array} Array of config entries or empty array
   */
  getAll(strFilter) {
    const allData = Object.assign({}, this.data);
    if (!strFilter) {
      return allData;
    }
    const filteredData = {};
    for (var key in allData) {
      if (key.startsWith(strFilter)) {
        filteredData[key] = allData[key];
      }
    }
    return filteredData;
  }

  /**
   * @description Set a config item by its key and passed in value
   * @argument {String} key The normalised key of the config setting
   * @argument {String} value The value to assign to the key
   * @returns {Object} value of passed in key from Config or null
   */
  set(key, value) {
    this.data[key] = value;
    return this;
  }

  /**
   * @description Copy the passed in Config over this config overwriting existing values
   * @argument {Config} config The config to copy over ours
   */
  copy(config) {
    const otherConfig = config.getAll();
    Object.keys(otherConfig).forEach(key => {
      this.set(key, otherConfig[key]);
    });
    return this;
  }

  /**
   * @description Return a copy of the current config
   * @returns {Config} a copy of this same config
   */
  clone() {
    const config = new Config();
    config.load(this.getAll());
    return config;
  }

  /**
   * @description Load all keys in bulk
   * @argument {Object} data The existing data to load
   * @returns {Config} this same config with the newly loaded data.
   */
  load(data) {
    if (data && data instanceof Config) {
      this.copy(data);
    } else {
      for (var key in data) {
        this.data[key] = data[key];
      }
    }
    return this;
  }

  /**
   * @description Returns all config as Hash of DOCKUI ENV vars (such that it can be piped into another instance)
   * @returns {Config} this same config with the newly loaded data.
   */
  toEnv(prefix) {
    const env = {};
    prefix = prefix ? prefix.toUpperCase() + "_" : "";
    for (var key in this.data) {
      const envKey =
        prefix +
        key
          .split(".")
          .join("_")
          .toUpperCase();
      env[envKey] = this.data[key];
    }
    return env;
  }
}

/**
 * @description Builder that generates a Config via provided ConfigLoaders
 */
class ConfigBuilder {
  constructor() {
    this.loaders = [];
  }

  /**
   * @description Specifies a Configloader to use
   * @argument {ConfigLoader} loader
   * @returns {ConfigBuilder} the current config builder for chaining
   */
  withConfigLoader(loader) {
    this.loaders.push(loader);
    return this;
  }

  /**
   * @description return a new Config instance using the builder values
   * @returns {Config} instance of Config
   */
  build() {
    return new Config(this);
  }
}

module.exports = {
  Config,
  ConfigBuilder
};
