/**
 * Loads a resource into a Config object
 */
class ConfigLoader {
  /**
   * Loads a resource and returns a new {Config} object
   * @returns {Config} The Config
   */
  load() {
    console.warn(
      "This method is a Raw NoOp. Expect consumers to provide concrete implementation via subclass"
    );
  }

  /**
   * Given an initial config object loads config from multiple sources
   * in order using passed in loaders.
   * @static
   * @argument {Config} config Existing Config
   * @argument {Array} loaders Array of Config loaders called in order
   * @returns {Config} The overloaded Config
   */
  static loadConfig(config, loaders) {
    var newConfig = Object.assign({}, config);
    loaders.forEach(loader => {
      const loaderConfig = loader.load();
      newConfig = Object.assign(newConfig, loaderConfig);
    });
    return newConfig;
  }
}

module.exports = ConfigLoader;
