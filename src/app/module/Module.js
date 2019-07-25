const { getHashFromModule } = require("../../util");

/**
 * @description Represents a single Module loaded from a Module Descriptor.
 */
class Module {
  /**
   * @argument {Object} data - Existing Module data
   */
  constructor({
    id,
    key,
    name,
    description = "",
    aliases = [],
    type = "generic",
    // Modules default to enabled, but only the enabled Modules will become
    // fully enabled if the parent app is enabled by an admin
    enabled = true,
    cache = { policy: "disabled" },
    roles = [],
    appId = null,
    auth = null
  } = {}) {
    this.key = key ? key : this.id;
    this.name = name ? name : this.key;
    this.description = description;
    this.aliases = aliases;
    this.type = type;
    this.enabled = enabled;
    this.cache = cache;
    this.roles = roles;
    this.docType = Module.DOCTYPE;
    this.appId = appId;
    this.auth = auth;
    // Only generate ID once the rest of the info has been set
    this.id = id ? id : getHashFromModule(this);
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
   * @description The Human readable description of this Module
   */
  getDescription() {
    return this.description;
  }

  /**
   * @description The alternative names for this module (used for pretty urls etc)
   */
  getAliases() {
    return this.aliases;
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
   * @description Optional per module auth config - this is only used if there
   *              is an AuthenticationProvider which understand the config
   */
  getAuth() {
    return this.auth;
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
      description: this.description,
      aliases: this.aliases,
      type: this.type,
      enabled: this.enabled,
      cache: this.cache,
      roles: this.roles,
      appId: this.appId,
      auth: this.auth
    };
    return json;
  }
}

Module.DESCRIPTOR_TYPE = "Generic";

/**
 * @static
 * @description Represents the docType for use when persisting
 */
Module.DOCTYPE = "MODULE";

module.exports = Module;
