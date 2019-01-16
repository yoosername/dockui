const  {
  MalformedAppDescriptorError
} = require("../../constants/errors");

/**
 * Loads a descriptor in JSON format into a useable object
 */
class AppDescriptor{

    /**
     * @param {JSON} descriptor - Raw JSON descriptor parsed from App service endpoint
     * @param {String} url - Optional URL to overwrite the parsed Descriptor URL (e.g. for Docker private URLs)
     */
    constructor(descriptor, url){

      const actualURL = (url) ? url : descriptor.url;

      if(
        !descriptor.key||
        !actualURL||
        !descriptor.lifecycle||
        !descriptor.lifecycle.loaded ||
        !descriptor.authentication ||
        !descriptor.authentication.type
      ){
        throw new MalformedAppDescriptorError();
      }

      this.key = descriptor.key;
      this.url = descriptor.url;
      this.name = (descriptor.name) ? descriptor.name : descriptor.key;
      this.version = (descriptor.version) ? descriptor.version : '1.0.0';
      this.descriptorVersion = (descriptor['descriptor-version']) ? descriptor['descriptor-version'] : '1';
      this.logo = (descriptor.logo) ? descriptor.logo : "";

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
     * @returns {string} key - The key to return
     */
    getKey(){
      return this.key;
    }

    getUrl(){
      return this.url;
    }

    getName(){
      return this.name;
    }

    getVersion(){
      return this.version;
    }

    getDescriptorVersion(){
      return this.descriptorVersion;
    }

    getLogo(){
      return this.logo;
    }

    getAuthentication(){
      return this.authentication;
    }

    getLifecycleURLs(){
      return this.lifecycleURLs;
    }

    getModules(){
      return this.modules;
    }
  
  }
  
  module.exports = AppDescriptor;