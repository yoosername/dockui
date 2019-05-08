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
      throw new Error("Malformed AppDescriptor");
    }

    this.name = descriptor.name ? descriptor.name : descriptor.key;
    this.key = descriptor.key;
    this.type = descriptor.type;
    this.url = descriptor.url;
    this.description = descriptor.description;
    this.version = descriptor.version ? descriptor.version : "1.0.0";
    this.descriptorVersion = descriptor["descriptor-version"]
      ? descriptor["descriptor-version"]
      : "1";
    this.icon = descriptor.icon ? descriptor.icon : "";

    this.authentication = {
      type: descriptor.authentication.type
    };
    this.lifecycle = {
      loaded: descriptor.lifecycle.loaded
    };

    this.modules = descriptor.modules ? descriptor.modules : [];
  }

  /**
   * Returns Name
   * @returns {string} Human readable App Name
   */
  getName() {
    return this.name;
  }

  /**
   * Returns key
   * @returns {string} The App key
   */
  getKey() {
    return this.key;
  }

  /**
   * Returns Type
   * @returns {string} Whether this is a Dynamic or Static App
   */
  getType() {
    return this.type;
  }

  /**
   * Returns URL
   * @returns {string} The App base url
   */
  getUrl() {
    return this.url;
  }

  /**
   * Returns Description
   * @returns {string} The App description
   */
  getDescription() {
    return this.description;
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
   * Returns Icon
   * @returns {string} Relative URL of Apps Icon image file
   */
  getIcon() {
    return this.icon;
  }

  /**
   * Returns Lifecycle
   * @returns {string} URLs of lifecycle endpoints to be notified of various framework events
   */
  getLifecycle() {
    return this.lifecycle;
  }

  /**
   * Returns Authentication
   * @returns {string} Type of Auth required by App ( e.g. JWT )
   */
  getAuthentication() {
    return this.authentication;
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
