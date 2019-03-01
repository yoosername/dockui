const { ConfigValidationError } = require("../constants/errors");

/**
 * A Config encapsulates configuration information derived from a DockUI config source
 */
class Config {
  /**
   * @argument {ConfigBuilder} builder
   * @throws ConfigValidationError
   */
  constructor(builder) {
    if (!builder) {
      return new ConfigBuilder();
    }

    this.store = builder.store;
    this.events = builder.events;
    this.port = builder.port;
    this.secret = builder.secret;
  }
}

/**
 * @description Builder that generates a DockUI Config
 */
class ConfigBuilder {
  constructor() {
    this.store = null;
    this.events = null;
    this.port = null;
    this.secret = null;
  }

  /**
   * @description Specifies the Store ( defaults to local file store )
   * @argument {String} store
   * @returns {ConfigBuilder} the current config builder for chaining
   */
  withStore(store) {
    this.store = store;
    return this;
  }

  /**
   * @description Specifies the Events/Messaging service to use ( defaults to in memory )
   * @argument {String} events
   * @returns {ConfigBuilder} the current config builder for chaining
   */
  withEvents(events) {
    this.events = events;
    return this;
  }

  /**
   * @description Specifies the Web Port to listen on ( defaults to 5000 )
   * @argument {String} port
   * @returns {ConfigBuilder} the current config builder for chaining
   */
  withPort(port) {
    this.port = port;
    return this;
  }

  /**
   * @description Specifies the initial root secret (defaults to changeme)
   * @argument {String} secret
   * @returns {ConfigBuilder} the current config builder for chaining
   */
  withSecret(secret) {
    this.secret = secret;
    return this;
  }

  /**
   * @description return a new Config instance using the builder values
   * @returns {Config} instance of Config
   */
  build() {
    return new Config(this);
  }
}

module.exports = {
  Config,
  ConfigBuilder
};
