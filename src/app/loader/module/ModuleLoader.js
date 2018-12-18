const crypto = require('crypto');

const createHash = (descriptor) => {
    "use strict";

    var hmac = crypto.createHmac('sha256', 'a secret');
    const descriptorString = JSON.stringify(descriptor);
    hmac.update(descriptorString);
    const hash = hmac.digest('hex');
    hmac = null;
    return hash;
};

/**
 * @class ModuleLoader
 * @description Creates a Module object from a descriptor
 */
class ModuleLoader{

    constructor(){
        this.cache = {};
    }
  
    /**
     * @method getCache
     * @description get an entry from the Cache or null if not exist
     */
    getCache(descriptor){
        const hash = createHash(descriptor);
        return (hash && this.cache.hasOwnProperty(hash)) ? this.cache[hash] : null;
    }

    /**
     * @method setCache
     * @description set an entry to the cache keyed on the hash of the descriptor
     */
    setCache(descriptor, state){
        const hash = createHash(descriptor);
        this.cache[hash] = state;
    }

    /**
     * @method canLoadModuleDescriptor
     * @description Return true if this descriptor can be parsed by this Loader.
     *              Implementations should:
     *               - Parse descriptor
     *               - Check and validate values
     *               - Return true if can successfully create a Module
     *               - Return false if cannot create Module
     */
    canLoadModuleDescriptor(descriptor){
      console.warn("[ModuleLoader] NoOp implementation - this should be extended by child classes");
    }
  
    /**
     * @method loadModuleFromDescriptor
     * @description Create and return a new RouteModule from the descriptor
     *              Implementations should:
     *               - Parse descriptor
     *               - Check and validate values
     *               - Return new subclass Module object
     */
    loadModuleFromDescriptor(descriptor){
        console.warn("[ModuleLoader] NoOp implementation - this should be extended by child classes");
    }
  
  }
  
  module.exports = ModuleLoader;