const uuidv4 = require("uuid/v4");
const Module = require("./module/Module");

const DEFAULT_APP_VERSION = "1.0.0";
const DEFAULT_DESCRIPTOR_VERSION = "1.0.0";
/**
 * @description Represents a single App.
 * @argument {Object} data - Existing App data
 */
class App {
  constructor({
    id = uuidv4(),
    key = id,
    name = id,
    url = null,
    type = App.types.STATIC,
    description = id,
    version = DEFAULT_APP_VERSION,
    descriptorVersion = DEFAULT_DESCRIPTOR_VERSION,
    icon = null,
    build = null,
    lifecycle = null,
    authentication = App.auth.JWT,
    enabled = false,
    modules = [],
    permission = App.permissions.READ
  } = {}) {
    this.id = id;
    this.key = key;
    this.name = name;
    this.url = url;
    this.type = type;
    (this.description = description),
      (this.version = version),
      (this.descriptorVersion = descriptorVersion),
      (this.icon = icon),
      (this.build = build),
      (this.lifecycle = lifecycle),
      (this.authentication = authentication),
      (this.enabled = enabled);
    this.modules = modules.map(module => {
      return new Module(module);
    });
    this.permission = permission;
  }

  /**
   * @description Return true if the App is currently enabled
   * @returns {Boolean} Return true if this App is currently enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * @description Return the uniquely generated framework identifier of this App instance
   * @returns {String} id
   */
  getId() {
    return this.id;
  }

  /**
   * @description return the unique key of this App
   * @returns {String} The Apps key
   */
  getKey() {
    return this.key;
  }

  /**
   * @description return the Human Readable name of this App
   * @returns {String} The Apps name
   */
  getName() {
    return this.name;
  }

  /**
   * @description Returns the assigned permission of this App.
   * @returns {String} The permission granted to this App.
   * @example App.permissions.READ
   * @example App.permissions.WRITE
   * @example App.permissions.ADMIN
   */
  getPermission() {
    return this.permission;
  }

  /**
   * @description Return the type of this App
   * @returns {String} Type
   * @example App.types.STATIC
   * @example App.types.DYNAMIC
   */
  getType() {
    return this.type;
  }

  /**
   * @description Return the description of this App
   * @returns {String} description
   */
  getDescription() {
    return this.description;
  }

  /**
   * @description Return the version of this App
   * @returns {String} version
   */
  getVersion() {
    return this.version;
  }

  /**
   * @description Return the descriptor version of the descriptor that this App was loaded from
   * @returns {String} version
   */
  getDescriptorVersion() {
    return this.descriptorVersion;
  }

  /**
   * @description Return (optional) build instructions for this App
   *              - If there are build instructions the App Load worker may choose to
   *              - delegate a task for building the source first
   * @returns {Array} Array of Build instructions
   */
  getBuild() {
    return this.build;
  }

  /**
   * @description Return lifecycle callback URLs of the App
   * @returns {Object} dictionary of lifecycle callback URLs
   */
  getLifecycle() {
    return this.lifecycle;
  }

  /**
   * @description Return Authentication type specified in the App desriptor
   * @returns {String} Auth type (e.g. App.auth.JWT...)
   */
  getAuthentication() {
    return this.authentication;
  }

  /**
   * @description Return (optional) build instructions for this App
   *              - this is used by the loader to e.g. build an App from source as opposed to direct serve
   * @returns {Array} Array of Build instructions
   */
  getBuild() {
    return this.build;
  }

  /**
   * @description Return the relative URL to the apps Icon
   * @returns {String} url of App icon
   */
  getIcon() {
    return this.icon;
  }

  /**
   * @description The base URL
   * @returns {String} URL
   */
  getUrl() {
    return this.url;
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
   * @description Helper to return a serialized version of this App for storage/transport
   * @returns {JSON} A Pure JSON representation of the App
   */
  toJSON() {
    const json = {
      key: this.key,
      name: this.name,
      url: this.url,
      type: this.type,
      description: this.description,
      version: this.version,
      descriptorVersion: this.descriptorVersion,
      icon: this.icon,
      build: this.build,
      lifecycle: this.lifecycle,
      authentication: this.authentication,
      enabled: this.enabled,
      permission: this.permission,
      modules: []
    };
    this.modules.forEach(module => {
      json.modules.push(module.toJSON());
    });
    return json;
  }
}

/**
 * @static
 * @description Represents the available types of the App
 */
App.types = Object.freeze({
  STATIC: "STATIC",
  DYNAMIC: "DYNAMIC"
});

/**
 * @static
 * @description Represents the available auth mechanisms for connecting with the App
 */
App.auth = Object.freeze({
  JWT: "JWT"
});

/**
 * @static
 * @description Represents the available permissions that can be grant the App
 */
App.permissions = Object.freeze({
  READ: "READ",
  WRITE: "WRITE",
  ADMIN: "ADMIN"
});

module.exports = App;
