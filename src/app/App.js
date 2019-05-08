const uuidv4 = require("uuid/v4");
const Module = require("./module/Module");

/**
 * @description Represents a single App.
 * @argument {Object} data - Existing App data
 */
class App {
  constructor({
    uuid = uuidv4(),
    key = uuid,
    name = uuid,
    url = null,
    type = App.types.STATIC,
    enabled = false,
    modules = [],
    permission = App.permissions.READ
  } = {}) {
    this.uuid = uuid;
    this.key = key;
    this.name = name;
    this.url = url;
    this.type = type;
    this.enabled = enabled;
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
   * @returns {String} UUID
   */
  getUUID() {
    return this.uuid;
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
    return this.type();
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
 * @description Represents the available permissions that can be grant the App
 */
App.permissions = Object.freeze({
  READ: "READ",
  WRITE: "WRITE",
  ADMIN: "ADMIN"
});

module.exports = App;
