var ModuleService = require("./module/ModuleService");
const EventEmitter = require('events');

class Plugin extends EventEmitter {
  constructor(pluginManager, network, port, containerId, pluginDescriptor) {
    super();
    this.pluginManager = pluginManager;
    this.network = network;
    this.port = port;
    this.modules = [];
    this.pluginDescriptor = pluginDescriptor;
    this.containerId = containerId;
    this.name = pluginDescriptor.name;
    this.key = pluginDescriptor.key;
  }

  loadModules(){

    if( this.pluginDescriptor && this.pluginDescriptor != undefined){
      var modules = this.pluginDescriptor.modules;
      if( modules ){
        modules.forEach(function(moduleDescriptor){
          var module = ModuleService.createModuleInstance(this, moduleDescriptor);
          if( module ){
            this.modules.push(module);
            this.emit("module:added", module);
          }else{
            console.log("Error: cannot create module of type: ", moduleDescriptor.type);
          }

        }.bind(this));
      }else{
        console.log("plugin ", this.key, " doesnt define any modules", this.descriptor);
      }
    }else{
      console.log("plugin ", this.key, " doesnt have a vaild descriptor", this.descriptor);
    }
  }

  getPluginManager(){
    return this.pluginManager;
  }

  getContainerId(){
    return this.containerId;
  }

  getModules(){
    return this.modules;
  }

  getName(){
    return this.name;
  }

  getKey(){
    return this.key;
  }

  getNetwork(){
    return this.network;
  }

  getPort(){
    return this.port;
  }

  getModuleByType(type){
    var foundModules = [];
    this.modules.forEach(function(module){
      if( module.getType() == type ){
        foundModules.push(module);
      }
    });
    return foundModules;
  }

  getModuleByKey(key){
    var foundModule = null;
    this.modules.forEach(function(module){
      if( module.getKey() == key ){
        foundModule = module;
      }
    });
    return foundModule;
  }

  sendMessage(msg){
    // TODO: Connect to the global message queue and send a message to the queue with the plugins key
  }

}

module.exports = Plugin;
