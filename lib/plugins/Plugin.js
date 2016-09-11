var moduleUtil = require("./modules/util");
const EventEmitter = require('events');

class Plugin extends EventEmitter {
  constructor(containerId, pluginDescriptor) {
    super();
    this.modules = [];
    this.pluginDescriptor = pluginDescriptor;
    this.containerId = containerId;
    this.name = pluginDescriptor.name;
    this.key = pluginDescriptor.key;
  }

  loadModules(){
    var modules = this.pluginDescriptor.modules;
    if( modules ){
      modules.forEach(function(moduleDescriptor){
        var module = moduleUtil.getModuleByType(moduleDescriptor.type, this.containerId, this.key, moduleDescriptor);
        if( module ){
          this.modules.push(module);
          this.emit("module:added", module);
        }else{
          console.log("error: cannot load module: ", moduleDescriptor);
        }

      }.bind(this));
    }else{
      console.log("plugin ", this.key, " doesnt define any modules")
    }
  }

  getContainerId(){
    return this.containerId;
  }

  getName(){
    return this.name;
  }

  getKey(){
    return this.key;
  }

}

module.exports = Plugin;
