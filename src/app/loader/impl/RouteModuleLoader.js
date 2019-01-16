const CachableModuleLoader = require("./CachableModuleLoader");
const RouteModuleDescriptor = require("../../descriptor/impl/RouteModuleDescriptor");
const RouteModule = require("../../module/impl/RouteModule");

/**
 * @class RouteModuleLoader
 * @description Create a RouteModule from a descriptor
 */
class RouteModuleLoader extends CachableModuleLoader{

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
    const cachedResponse = this.canLoadModuleFromCache(descriptor);
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
      moduleDescriptor = new RouteModuleDescriptor(descriptor);
      apiModule = new RouteModule(moduleDescriptor);
      if(apiModule !== null){
        response = true;
        this.setCache(descriptor, {
          loadable : true,
          module: apiModule
        });
      }
    }catch(e){
      response = false;
      this.setCache(descriptor, {
        loadable : false
      });
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
    const cachedModule = this.loadModuleFromCache(descriptor);
    if( cachedModule ){
      return cachedModule; 
    }

    // Nothing in the cache so do verify ourself:
    const doesLoad = this.canLoadModuleDescriptor(descriptor);
    if( doesLoad ){
      const module = this.loadModuleFromCache(descriptor);
      if(module){
        return module;
      }
    }

    // We cant load the Module so return null
    // App will try more loaders and then handle the case where none work.
    return null;

  }

}

module.exports = RouteModuleLoader;