const uuidv4 = require("uuid/v4");

/**
 * @description Represents a single Module loaded from a Module Descriptor.
 */
class Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({
    id = uuidv4(),
    key = id,
    name = id,
    type = "generic",
    // Modules default to enabled, but only the enabled Modules will become
    // fully enabled if the parent app is enabled by an admin
    enabled = true,
    cache = { policy: "disabled" },
    roles = [],
    appId = null
  } = {}) {
    this.id = id;
    this.key = key;
    this.name = name;
    this.type = type;
    this.enabled = enabled;
    this.cache = cache;
    this.roles = roles;
    this.docType = Module.DOCTYPE;
    this.appId = appId;
  }

  /**
   * @description The Universal Id of this Module
   */
  getId() {
    return this.id;
  }

  /**
   * @description The key of this Module
   */
  getKey() {
    return this.key;
  }

  /**
   * @description The Human readable name of this Module
   */
  getName() {
    return this.name;
  }

  /**
   * @description The type of this Module
   */
  getType() {
    return this.type;
  }

  /**
   * @description If This module is enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * @description Return the roles are required to use this module
   *              or Null if no Roles required.
   */
  getCache() {
    return this.cache;
  }

  /**
   * @description If Caching is supported and enabled by this module
   */
  isCacheEnabled() {
    return this.cache.policy === "enabled";
  }

  /**
   * @description Return the roles are required to use this module
   *              or Null if no Roles required.
   */
  getRoles() {
    return this.roles && this.roles.length && this.roles.length >= 0
      ? this.roles
      : null;
  }

  /**
   * @description The ID of the App this Module belongs to
   */
  getAppId() {
    return this.appId;
  }

  /**
   * @description Set the appId that this Module belongs to.
   */
  setAppId(appId) {
    return (this.appId = appId);
  }

  /**
   * @description Helper to return a serialized version of this Module for storage/transport
   * @returns {JSON} A Pure JSON representation of the Module
   */
  toJSON() {
    const json = {
      docType: this.docType,
      id: this.id,
      key: this.key,
      name: this.name,
      type: this.type,
      enabled: this.enabled,
      cache: this.cache,
      roles: this.roles,
      appId: this.appId
    };
    return json;
  }
}

/**
 * @static
 * @description Represents the docType for use when persisting
 */
Module.DOCTYPE = "MODULE";

module.exports = Module;
