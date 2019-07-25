const { Config } = require("../../config/Config");
const App = require("../App");
const Logger = require("../../log/Logger");
const yaml = require("js-yaml");

const request = require("request-promise-native");
const { configAwareFetcher } = require("../../util");

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
    this.logger = builder.logger.child({
      config: { "service.name": "AppLoader" }
    });
    this.loaders = builder.loaders;
  }

  /**
   * @async
   * @description Asyncronously load an App from a remote descriptor by its URL
   * @argument {String} url URL of the App Descriptor
   * @argument {String} permission Permission we wish to grant the App
   * @argument {Object} fetcher Function which takes a URL and returns content as a String
   */
  load({ url, permission, fetcher = configAwareFetcher(this.config) }) {
    return new Promise(async (resolve, reject) => {
      let descriptor;
      let options = { method: "GET", uri: url };

      // Use the fetcher to fetch the descriptor file
      this.logger.debug("Fetching Descriptor from (url=%s)", url);
      try {
        // const response = await fetcher(options);
        const response = await fetcher(options);
        if (response.statusCode === 200) {
          descriptor = response.body;
        } else {
          this.logger.debug("Error fetching Descriptor, response = ", response);
        }
      } catch (err) {
        throw new Error(err);
      }

      // If not JSON already then turn the YAML into JSON
      if (!typeof descriptor === "object" || (descriptor && !descriptor.key)) {
        this.logger.debug(
          "Descriptor may be YAML, attemting to convert it to JSON"
        );
        try {
          descriptor = yaml.safeLoad(descriptor);
        } catch (e) {
          throw new Error(e);
        }
      }

      // If we got the descriptor ok then create App from it
      try {
        if (descriptor && descriptor.key) {
          this.logger.debug("Descriptor fetched/converted successfully");
          // Get the actual hostname we have been loaded from
          const origin = new URL(url).origin;
          // Get initial shape from the fetched descriptor
          const shape = {
            key: descriptor.key,
            name: descriptor.name,
            alias: descriptor.alias,
            baseUrl: origin,
            type: descriptor.type,
            description: descriptor.description,
            version: descriptor.version,
            descriptorVersion: descriptor.descriptorVersion,
            descriptorName: descriptor.descriptorName,
            icon: descriptor.icon,
            build: descriptor.build,
            lifecycle: descriptor.lifecycle,
            authentication: descriptor.authentication,
            permission: permission,
            modules: []
          };

          // Create an App from the shape
          const app = new App(shape);
          let modules = [];

          // If there are any modules defined
          if (descriptor.modules) {
            this.logger.debug(
              "Attempting to Load (%s) modules for App(key=%s)",
              descriptor.modules.length,
              shape.key
            );
            // For Each Module - Get the descriptor
            for (let index = 0; index < descriptor.modules.length; index++) {
              const moduleDescriptor = descriptor.modules[index];
              // For Each Module Loader - get the loader
              for (let idx = 0; idx < this.loaders.length; idx++) {
                const loader = this.loaders[idx];
                // Test if it can load the module descriptor
                if (loader.canLoadModuleDescriptor(moduleDescriptor)) {
                  this.logger.debug(
                    "Loader (type=%s) can load this Module Descriptor(key=%s)",
                    loader.constructor.name,
                    moduleDescriptor.key
                  );
                  // Add the appId to the shape
                  const moduleShape = Object.assign({}, moduleDescriptor, {
                    appId: app.getId()
                  });
                  // And if it can create the Module using the Loader
                  const module = await loader.loadModuleFromDescriptor(
                    moduleShape
                  );
                  // Add it to the ones we will link to the App
                  modules.push(module);
                  // And continue to the next Module
                  break;
                }
              }
            }
          }
          // Now set the apps modules
          app.setModules(modules);

          // Resolve with the new App
          resolve(app);
        }
      } catch (err) {
        reject(new Error(err));
      }
    });
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
    this.logger = new Logger(this.config);
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
   * @description Use the specified Logger
   * @argument {Logger} logger The Logger to use
   */
  withLogger(logger) {
    this.logger = logger;
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
