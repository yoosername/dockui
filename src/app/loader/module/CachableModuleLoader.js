const ModuleLoader = require('./ModuleLoader');
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
 * @class CachableModuleLoader
 * @description Creates a Module object from a descriptor
 *              - looks in cache first
 */
class CachableModuleLoader extends ModuleLoader{

    constructor(){
        super();
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
     * @method canLoadModuleFromCache
     * @description Returns true if entry in cache as being loadable
     *              Returns False if entry in cache as not being loadable
     *              Returns null if no entry - means another loader should handle it
     */
    canLoadModuleFromCache(descriptor){
        const cached = this.getCache(descriptor);
        if(cached && cached.state && cached.state.loadable){
            if(cached.state.loadable === true){
                return true;
            }
            return false;
        }
        return null;
    }
  
    /**
     * @method loadModuleFromCache
     * @description Return the Module saved in the cache
     */
    loadModuleFromCache(descriptor){
        const cached = this.getCache(descriptor);
        if(cached && cached.state && cached.state.module){
            return cached.state.module;
        }
    }
  
  }
  
  module.exports = CachableModuleLoader;