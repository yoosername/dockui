const  {
  MalformedAppDescriptorError
} = require("../../../constants/errors");

/**
 * @class AppDescriptor
 * @description Loads a descriptor in JSON format into a useable object
 * @argument {JSON} descriptor - Raw JSON descriptor parsed from App service endpoint
 * @argument {string} url - Optional URL to overwrite the parsed Descriptor URL (e.g. for Docker private URLs)
 */
class AppDescriptor{

    constructor(descriptor, url){

      const actualURL = (url) ? url : descriptor.url;

      if(
        !descriptor.key||
        !actualURL||
        !descriptor.lifecycle||
        !descriptor.lifecycle.installed ||
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

    }

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
  
  }
  
  module.exports = AppDescriptor;