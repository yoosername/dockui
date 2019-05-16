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
   * @returns {Array} Array of config entries or empty array
   */
  getAll() {
    return Object.assign({}, this.data);
  }

  /**
   * @description Set a config item by its key and passed in value
   * @argument {String} key The normalised key of the config setting
   * @argument {String} value The value to assign to the key
   * @returns {Object} value of passed in key from Config or null
   */
  set(key, value) {
    this.data[key] = value;
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
