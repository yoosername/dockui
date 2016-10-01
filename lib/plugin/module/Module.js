const EventEmitter = require('events');

class Module extends EventEmitter {
  constructor(plugin, moduleDescriptor) {
    super();

    //console.log("descriptor: ", moduleDescriptor);
    this.plugin = plugin;
    this.name = moduleDescriptor.name;
    this.key = moduleDescriptor.key;
    this.type = moduleDescriptor.type;
    this.auth = moduleDescriptor.auth || null;
    this.moduleDescriptor = moduleDescriptor;
  }

  getPluginManager(){
    return this.getPlugin().getPluginManager();
  }

  getPlugin(){
    return this.plugin;
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

  requiresAuth(){
    return (this.auth) ? true : false;
  }

  getAuth(){
    return this.auth;
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
