const { Config } = require("../../config/Config");
const App = require("../App");
const request = require("request-promise-native");
const yaml = require("js-yaml");

const defaultFetcher = async url => {
  let data = {};
  try {
    data = await request.get(url);
  } catch (e) {
    throw new Error(`Error fetching Descriptor from URL(${url}) : ${e}`);
  }
  return data;
};

const isJson = json => {
  var str = json.toString();
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

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
   * @argument {String} permission Permission we wish to grant the App
   * @argument {Object} fetcher Function which takes a URL and returns content as a String
   */
  load({ url, permission, fetcher = defaultFetcher }) {
    return new Promise(async (resolve, reject) => {
      let original, descriptor;
      // Use the fetcher to fetch the descriptor file
      try {
        descriptor = await fetcher(url);
      } catch (err) {
        throw new Error(err);
      }

      // If not JSON already then turn the YAML into JSON
      if (!typeof descriptor === "object" || !descriptor.key) {
        try {
          descriptor = yaml.safeLoad(descriptor);
        } catch (e) {
          throw new Error(e);
        }
      }

      // If we got the descriptor ok then create App from it
      try {
        if (descriptor && descriptor.key) {
          // Get initial shape from the fetched descriptor
          const shape = {
            key: descriptor.key,
            name: descriptor.name,
            url: url,
            type: descriptor.type,
            description: descriptor.description,
            version: descriptor.version,
            descriptorVersion: descriptor.descriptorVersion,
            icon: descriptor.icon,
            build: descriptor.build,
            lifecycle: descriptor.lifecycle,
            authentication: descriptor.authentication,
            permission: permission,
            modules: []
          };

          // If there are any modules defined, see if any moduleLoaders can handle them
          if (descriptor.modules) {
            descriptor.modules.forEach(module => {
              for (var loader in this.loaders) {
                if (this.loaders[loader].canLoadModuleDescriptor(module)) {
                  shape.modules.push(
                    this.loaders[loader].loadModuleFromDescriptor(module)
                  );
                  break;
                }
              }
            });
          }

          // Create an App from the shape and return it
          const app = new App(shape);
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
