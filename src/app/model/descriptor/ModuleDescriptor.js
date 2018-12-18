const  {
  MalformedModuleDescriptorError
} = require("../../../constants/errors");

/**
 * @class ModuleDescriptor
 * @description Loads a descriptor in JSON format into a Pojo
 */
class ModuleDescriptor{

    constructor(descriptor){

      if(!descriptor.type||!descriptor.name||!descriptor.key){
        throw new MalformedModuleDescriptorError();
      }

      // Minimum Required fields
      this.type = descriptor.type;
      this.name = descriptor.name;
      this.key = descriptor.key;

      // Common but optional fields
      this.weight = (descriptor.weight) ? parseInt(descriptor.weight) : 0;
      this.cache = (descriptor.cache) ? descriptor.cache : {policy: "disabled"};
      this.roles = (descriptor.roles) ? descriptor.roles : [];

    }

    getType(){
      return this.type;
    }

    getName(){
      return this.name;
    }

    getKey(){
      return this.key;
    }

    getWeight(){
      return this.weight;
    }

    getCache(){
      return this.cache;
    }

    getRoles(){
      return this.roles;
    }
  
  }
  
  module.exports = ModuleDescriptor;