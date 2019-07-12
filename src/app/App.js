const crypto = require("crypto");
const Module = require("./module/Module");
const ModuleFactory = require("./module/factory/ModuleFactory");

const DEFAULT_APP_VERSION = "1.0.0";
const DEFAULT_DESCRIPTOR_VERSION = "1.0.0";
const DEFAULT_DESCRIPTOR_NAME = "dockui.app.yml";

/**
 * @description Generate a Unique Id from data in an App (Id should be repeatable from same data)
 * @argument {App} app - The App from which to generate an ID
 * @returns {String} The generated ID
 */
const generateUniqueAppId = app => {
  const key = app.getKey();
  const version = app.getVersion();
  const hash = crypto
    .createHash("sha256")
    .update(`${key}${version}`)
    .digest("hex");
  return hash;
};

/**
 * @description Represents a single App.
 * @argument {Object} data - Existing App data
 */
class App {
  constructor({
    id,
    key,
    name,
    alias = null,
    baseUrl = null,
    type = App.types.STATIC,
    description = id,
    version = DEFAULT_APP_VERSION,
    descriptorVersion = DEFAULT_DESCRIPTOR_VERSION,
    descriptorName = DEFAULT_DESCRIPTOR_NAME,
    icon = null,
    build = null,
    lifecycle = null,
    authentication = App.auth.JWT,
    enabled = false,
    modules = [],
    permission = App.permissions.READ
  } = {}) {
    this.id = generateUniqueAppId(this);
    this.key = key ? key : this.id;
    this.name = name ? name : this.key;
    this.alias = alias;
    this.baseUrl = baseUrl;
    this.type = type;
    this.description = description;
    this.version = version;
    this.descriptorVersion = descriptorVersion;
    this.descriptorName = descriptorName;
    this.icon = icon;
    this.build = build;
    this.lifecycle = lifecycle;
    this.authentication = authentication;
    this.enabled = enabled;
    this.setModules(modules);
    this.permission = permission;
    this.docType = App.DOCTYPE;
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
   * @description return the Alias of this App ( used for better looking urls etc )
   * @returns {String} The Apps alias
   */
  getAlias() {
    return this.alias;
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
   * @returns {String} descriptorVersion
   */
  getDescriptorVersion() {
    return this.descriptorVersion;
  }

  /**
   * @description Return the descriptor name of the descriptor that this App was loaded from
   *              - defaults to dockui.app.yml
   * @returns {String} descriptorName
   */
  getDescriptorName() {
    return this.descriptorName;
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
  getBaseUrl() {
    return this.baseUrl;
  }

  /**
   * @description Return all the modules that have been loaded (optionally filtered using truthy predicate)
   * @argument {Function} predicate A function returning a truthy value
   * @returns {Array} Array of Module
   */
  getModules(predicate) {
    if (!predicate) {
      return this.modules;
    }
    return this.modules.filter(predicate);
  }

  /**
   * @description Set the modules associated with this App. Overwrites any existing Modules
   * @argument {Array[Module]} modules An Array of Modules to add to this App
   * @returns {Array} Array of Module
   */
  setModules(modules) {
    const actualModules = modules.map(module => {
      let instance = module;
      // If its not a Module instance make it one first
      if (!(instance instanceof Module)) {
        instance = ModuleFactory.create({ module: instance });
      }
      // Set the AppId to this App
      instance.setAppId(this.getId());
      return instance;
    });

    this.modules = actualModules;
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
      docType: this.docType,
      id: this.id,
      key: this.key,
      name: this.name,
      alias: this.alias,
      baseUrl: this.baseUrl,
      type: this.type,
      description: this.description,
      version: this.version,
      descriptorVersion: this.descriptorVersion,
      descriptorName: this.descriptorName,
      icon: this.icon,
      build: this.build,
      lifecycle: this.lifecycle,
      authentication: this.authentication,
      enabled: this.enabled,
      permission: this.permission,
      modules: []
    };
    if (this.modules && this.modules.length && this.modules.length > 0) {
      this.modules.forEach(module => {
        json.modules.push(module.toJSON());
      });
    }
    return json;
  }
}

/**
 * @static
 * @description Represents the available states of the App
 */
App.states = Object.freeze({
  LOADED: "LOADED", // When App is first loaded but not yet enabled
  ENABLED: "ENABLED", // When an App has been enabled through the management interface
  DISABLED: "DISABLED" // When an App is loaded but specifically disabled
});

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
 * @description Represents the docType for use when persisting
 */
App.DOCTYPE = "APP";

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
  DEFAULT: "READ",
  READ: "READ",
  WRITE: "WRITE",
  ADMIN: "ADMIN"
});

module.exports = App;
