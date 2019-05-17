const Config = require("../../config/Config");

/**
 * @description Encapsulates an external App and its Descriptor to be loaded
 */
class AppLoader {
  /**
   * @argument {AppLoaderBuilder} builder
   */
  constructor(builder) {
    if (!builder) {
      return new AppLoaderBuilder();
    }
    this.config = builder.config;
    this.loaders = builder.loaders;
  }

  /**
   * @async
   * @description Asyncronously load an App from a remote descriptor by its URL
   * @argument {String} url URL of the App Descriptor
   */
  load(url) {
    // 1: Check availability
    // 2: Performing Security Handshake
    // 3: Loading each module using passed in ModuleLoaders
    // 4: Resolves with the loaded App object
  }
}

/**
 * @description Builder that generates an AppLoader
 */
class AppLoaderBuilder {
  constructor() {
    this.config = new Config();
    this.loaders = [];
  }

  /**
   * @description Use the specified Config object
   * @argument {Config} config The Config to use
   */
  withConfig(config) {
    this.config = config;
    return this;
  }

  /**
   * @description Add the specified ModuleLoader object
   * @argument {ModuleLoader} loader The ModuleLoader to add
   */
  withModuleLoader(loader) {
    this.loaders.push(loader);
    return this;
  }

  /**
   * @description Return a new AppLoader instance using builder values
   * @returns {AppLoader} instance of AppLoader
   */
  build() {
    const instance = new AppLoader(this);
    return instance;
  }
}

module.exports = AppLoader;
