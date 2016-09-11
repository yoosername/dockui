const EventEmitter = require('events');

class Module extends EventEmitter {
  constructor(containerId, pluginKey, moduleDescriptor) {
    super();

    //console.log("descriptor: ", moduleDescriptor);
    this.containerId = containerId;
    this.pluginKey = pluginKey;
    this.name = moduleDescriptor.name;
    this.key = moduleDescriptor.key;
    this.type = moduleDescriptor.type;
    this.moduleDescriptor = moduleDescriptor;
  }

  getContainerId(){
    return this.containerId;
  }

  getPluginKey(){
    return this.pluginKey;
  }

  getName(){
    return this.name;
  }

  getKey(){
    return this.key;
  }

  getType(){
    return this.type;
  }

  valid(){
    // implementations should overide this
    var validName = (this.name && typeof this.name == "string");
    var validKey = (this.key && typeof this.key == "string");
    var validType = (this.type && typeof this.type == "string");
    if( validName && validKey && validType ){
      return true;
    }
    return false;
  }

}

module.exports = Module;
