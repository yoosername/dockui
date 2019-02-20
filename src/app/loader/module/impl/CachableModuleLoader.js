const ModuleLoader = require("../ModuleLoader");
const crypto = require("crypto");

const createHash = descriptor => {
  "use strict";

  var hmac = crypto.createHmac("sha256", "a secret");
  const descriptorString = JSON.stringify(descriptor);
  hmac.update(descriptorString);
  const hash = hmac.digest("hex");
  hmac = null;
  return hash;
};

/**
 * @description Creates a Module object from a descriptor
 *              - looks in cache first
 */
class CachableModuleLoader extends ModuleLoader {
  constructor() {
    super();
    this.cache = {};
  }

  /**
   * @description get an entry from the Cache or null if not exist
   * @argument {ModuleDescriptor} descriptor The ModuleDescriptor to retrieve from cache
   */
  getCache(descriptor) {
    const hash = createHash(descriptor);
    return hash && this.cache.hasOwnProperty(hash) ? this.cache[hash] : null;
  }

  /**
   * @description set an entry to the cache keyed on the hash of the descriptor
   * @argument {ModuleDescriptor} descriptor The ModuleDescriptor to cache
   * @argument {Object} state The information to save
   */
  setCache(descriptor, state) {
    const hash = createHash(descriptor);
    this.cache[hash] = state;
  }

  /**
   * @description Returns true if entry in cache as being loadable
   *              Returns False if entry in cache as not being loadable
   *              Returns null if no entry - means another loader should handle it
   * @argument {ModuleDescriptor} descriptor The ModuleDescriptor to test
   */
  canLoadModuleFromCache(descriptor) {
    const cached = this.getCache(descriptor);
    if (cached && cached.state && cached.state.loadable) {
      if (cached.state.loadable === true) {
        return true;
      }
      return false;
    }
    return null;
  }

  /**
   * @description Return the Module saved in the cache
   * @argument {ModuleDescriptor} descriptor The ModuleDescriptor to load
   */
  loadModuleFromCache(descriptor) {
    const cached = this.getCache(descriptor);
    if (cached && cached.state && cached.state.module) {
      return cached.state.module;
    }
  }
}

module.exports = CachableModuleLoader;
