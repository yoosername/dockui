// module decorator store
var modules = {};
var Module = require("./Module");
modules["webitem"] = require("./WebItem");
modules["webpage"] = require("./WebPage");
modules["webfragment"] = require("./WebFragment");
modules["webresources"] = require("./WebResources");

// look up a decorator by type return a decorated version of it
function createModuleInstance(plugin, moduleDescriptor){

  var type = moduleDescriptor.type;

  var module = modules[type];
  if(module == null){
   console.log("No module found of type: ", type);
   return null;
  }

  var instance = new module(plugin, moduleDescriptor);

  if( instance instanceof Module ){
    //console.log("instance is: ", instance);
    return instance;
  }else{
    console.log("module of type: ", type, ", doesnt extend Module");
  }

  return null;

}

exports.createModuleInstance = createModuleInstance;
