const  {
  MalformedModuleDescriptorError
} = require("../../constants/errors");

/**
 * @description Loads a raw JSON descriptor into a specific ModuleDescriptor object
 */
class ModuleDescriptor{

    /**
     * @argument {JSON} descriptor the raw descriptor
     */
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

    /**
     * @description Get the Module type
     */
    getType(){
      return this.type;
    }

    /**
     * @description Get the Module name
     */
    getName(){
      return this.name;
    }

    /**
     * @description Get the Module key
     */
    getKey(){
      return this.key;
    }

    /**
     * @description Get the Module weight
     */
    getWeight(){
      return this.weight;
    }

    /**
     * @description Get the Module cache settings
     */
    getCache(){
      return this.cache;
    }

    /**
     * @description Get the Modules required Roles
     */
    getRoles(){
      return this.roles;
    }
  
  }
  
  module.exports = ModuleDescriptor;