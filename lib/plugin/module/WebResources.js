const Module = require("./Module");

class WebResources extends Module{

  // TODO: This describes a static resource root and various files to include and exclude
  constructor(plugin, descriptor){
    super(plugin, descriptor);
    this.base = descriptor.base;
    this.resources = descriptor.resources;
    this.context = descriptor.context;
  }

  getBase(){
    return this.base;
  }

  getResources(){
    return this.resources;
  }

  getContext(){
    return this.context;
  }

  getResourcesForType(type){
    var resources = [];
    getResources().forEach(function(resource){
      if( resource.type == type ){
        resources.push(resource)
      }
    })
    return resources;
  }

  valid(){

    var validBase = (this.base && typeof this.base == "string");
    if( validBase && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = WebResources;
