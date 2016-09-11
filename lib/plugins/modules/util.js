// module decorator store
var modules = {};
var Module = require("./Module");
modules["webitem"] = require("./WebItem");
modules["webpage"] = require("./WebPage");
modules["webfragment"] = require("./WebFragment");

// look up a decorator by type return a decorated version of it
function getModuleByType(type, containerId, pluginKey, moduleDescriptor){

  var module = modules[type];
  if(module == null){
   console.log("No module found of type: ", type);
   return null;
  }

  var instance = new module(containerId, pluginKey, moduleDescriptor);

  if( instance instanceof Module ){
    //console.log("instance is: ", instance);
    return instance;
  }else{
    console.log("module of type: ", type, ", doesnt extend Module");
  }

  return null;

}

exports.getModuleByType = getModuleByType;
