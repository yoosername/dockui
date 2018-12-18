const CachableModuleLoader = require("./CachableModuleLoader");

const ApiModuleDescriptor = require("../../model/descriptor/ApiModuleDescriptor");
const ApiModule = require("../../model/ApiModule");

/**
 * @class ApiModuleLoader
 * @description Create a ApiModule from a descriptor
 */
class ApiModuleLoader extends CachableModuleLoader{

  constructor(){
    super();
  }

  /**
   * @method canLoadModuleDescriptor
   * @description Return true if this descriptor can be parsed and is 
   *              the required format to produce this type of Module
   */
  canLoadModuleDescriptor(descriptor){

    // Have we previously responded with a true
    const cachedResponse = super.canLoadModuleDescriptor(descriptor);
    if( cachedResponse === true ){
      return true; 
    }else if ( cachedResponse === false){
      return false;
    }

    // Nothing in the cache so:
    var moduleDescriptor = null;
    var apiModule = null;
    var response = false;
    try{
      moduleDescriptor = new ApiModuleDescriptor(descriptor);
      apiModule = new ApiModule(moduleDescriptor);
      if(apiModule != null){
        response = true;
      }
    }catch(e){
      response = false;
    }finally{
      moduleDescriptor = null;
      apiModule = null;
    }
    
    return response;
    
  }

  /**
   * @method loadModuleFromDescriptor
   * @description Create and return a new Module from the descriptor
   */
  loadModuleFromDescriptor(descriptor){

    // Have we previously created and returned a module
    const cachedModule = super.loadModuleFromDescriptor(descriptor);
    if( cachedModule ){
      return cachedModule; 
    }

    // Nothing in the cache so:
    //  - Parse config
    //  - Create and add to cache then return a new Module object
  }

}

module.exports = ApiModuleLoader;