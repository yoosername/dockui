const uuidv4 = require("uuid/v4");
const { validateShapes } = require("../util/validate");

/**
 * @description Represents a single App.
 * @argument {string} key - A universally unique key for this App.
 * @argument {string} permission - one of "READ", "WRITE", "ADMIN" (note these are additive)
 * @argument {AppDescriptor} descriptor - The AppDescriptor built from the Apps descriptor file.
 * @argument {Boolean} enabled - Whether or not this App should be enabled on Start (defaults to false)
 * @argument {String} uuid - An existing ID if this App has be rehydrated from a persitant DB (defaults to null)
 */
class App {
  constructor(key, permission, descriptor, enabled = false, uuid = null) {
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([{ shape: "AppDescriptor", object: descriptor }]);

    this.key = key;
    this.permission = permission;
    this.uuid = uuid ? uuid : uuidv4();
    this.descriptor = descriptor;
    this.enabled = enabled || false;
    this.modules = [];
  }

  /**
   * @description Return true if the App is currently enabled
   * @returns {Boolean} Return true if this App is currently enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * @description return the unique key of this App
   * @returns {String} The Apps key
   */
  getKey() {
    return this.key;
  }

  /**
   * @description Returns the assigned AppPermission of this App.
   * @returns {AppPermission} The AppPermission granted to this App.
   * @example AppPermission.READ
   * @example AppPermission.WRITE
   * @example AppPermission.ADMIN
   */
  getPermission() {
    return this.permission;
  }

  /**
   * @description Return the type of this App
   * @returns {String} Type
   * @example "static" or "dynamic"
   */
  getType() {
    return this.descriptor.getType();
  }

  /**
   * @description Helper returns the base URL from this Apps descriptor
   * @returns {String} URL
   */
  getUrl() {
    return this.descriptor.getUrl();
  }

  /**
   * @description Return the uniquely generated framework identifier of this App instance
   * @returns {String} UUID
   */
  getUUID() {
    return this.uuid;
  }

  /**
   * @description Return the App Descriptor this App was parsed from
   * @returns {AppDescriptor} AppDescriptor
   */
  getDescriptor() {
    return this.descriptor;
  }

  /**
   * @description Return all the modules that have been loaded (optionally filtered)
   * @returns {Array} Array of Module
   */
  getModules(filter) {
    if (!filter) {
      return this.modules;
    }
    return this.modules.filter(filter);
  }

  /**
   * @description return a single module by key
   * @returns {Module} A single Module that matches the passed key
   */
  getModule(key) {
    const filtered = this.modules.filter(module => {
      return module.getKey() === key;
    });
    return filtered[0];
  }

  /**
   * @description Try to parse the descriptor.modules and load
   * @argument {Array} ModuleDescriptors An array of descriptors to parse
   * @argument {Array} ModuleLoaders An array of loaders for parsing the passed in descriptors
   * all the modules in it using any of the passed in ModuleLoaders
   * Unloadable modules are loaded anyway but automatically disabled
   */
  loadModules(moduleDescriptors, moduleLoaders) {
    return new Promise(async (resolve, reject) => {
      moduleDescriptors.forEach(moduleDescriptor => {
        var module = null;
        var loaded = false;

        this.moduleLoaders.forEach(async moduleLoader => {
          try {
            if (
              !loaded &&
              moduleLoader.canLoadModuleDescriptor(moduleDescriptor)
            ) {
              module = await moduleLoader.loadModuleFromDescriptor(
                moduleDescriptor
              );
              if (module) {
                loaded = true;
              }
            }
          } catch (e) {
            // Do nothing as another loader might handle it
          }
        });
        if (!module) {
          // Here we could create a special UnloadableModule
          // that is automatically disabled - that contains its own error
        }
        if (module) {
          this.modules.push(module);
        } else {
        }
      });

      resolve();
    });
  }
}

module.exports = App;
