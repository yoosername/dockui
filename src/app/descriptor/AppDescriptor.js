const { MalformedAppDescriptorError } = require("../../constants/errors");

/**
 * Loads a descriptor in JSON format into a useable object
 */
class AppDescriptor {
  /**
   * @param {JSON} descriptor - Raw JSON descriptor parsed from App service endpoint
   * @param {String} url - Optional URL to overwrite the parsed Descriptor URL (e.g. for Docker private URLs)
   */
  constructor(descriptor, url) {
    const actualURL = url ? url : descriptor.url;

    if (
      !descriptor.key ||
      !actualURL ||
      !descriptor.lifecycle ||
      !descriptor.lifecycle.loaded ||
      !descriptor.authentication ||
      !descriptor.authentication.type
    ) {
      throw new MalformedAppDescriptorError();
    }

    this.key = descriptor.key;
    this.url = descriptor.url;
    this.name = descriptor.name ? descriptor.name : descriptor.key;
    this.version = descriptor.version ? descriptor.version : "1.0.0";
    this.descriptorVersion = descriptor["descriptor-version"]
      ? descriptor["descriptor-version"]
      : "1";
    this.logo = descriptor.logo ? descriptor.logo : "";

    this.authentication = {
      type: descriptor.authentication.type
    };
    this.lifecycleURLs = {
      loaded: descriptor.lifecycle.loaded
    };

    this.modules = descriptor.modules;
  }

  /**
   * Returns key
   * @returns {string} The App key
   */
  getKey() {
    return this.key;
  }

  /**
   * Returns URL
   * @returns {string} The App base url
   */
  getUrl() {
    return this.url;
  }

  /**
   * Returns Name
   * @returns {string} Human readable App Name
   */
  getName() {
    return this.name;
  }

  /**
   * Returns Version
   * @returns {string} App version
   */
  getVersion() {
    return this.version;
  }

  /**
   * Returns Descriptor Version
   * @returns {string} The version of the Descriptor used by the App
   */
  getDescriptorVersion() {
    return this.descriptorVersion;
  }

  /**
   * Returns Logo
   * @returns {string} Relative URL of Apps logo
   */
  getLogo() {
    return this.logo;
  }

  /**
   * Returns Authentication
   * @returns {string} Type of Auth required by App ( e.g. JWT )
   */
  getAuthentication() {
    return this.authentication;
  }

  /**
   * Returns LifecycleURLs
   * @returns {string} URLs of lifecycle endpoints to be notified of various framework events
   */
  getLifecycleURLs() {
    return this.lifecycleURLs;
  }

  /**
   * Returns Modules
   * @returns {Array} Array of this Apps Modules
   */
  getModules() {
    return this.modules;
  }
}

module.exports = AppDescriptor;
