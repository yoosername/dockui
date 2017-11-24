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
    this.base = moduleDescriptor.base || "";
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

  getBase(){
    return this.base;
  }

  requiredScopes(){
    var scopes = (this.auth && this.auth.scopes) ? this.auth.scopes : null;
    return (scopes && scopes.length && scopes.length > 0) ? scopes : null;
  }

  getAuth(){
    return this.auth;
  }

  getModuleBaseUrl(){
    var network = this.plugin.getNetwork();
    var port = this.plugin.getPort();
    var base = this.getBase();
    return "http://"+network+":"+port+base;
  }

  getUrl(req){
    var moduleBaseUrl = this.getModuleBaseUrl();
    var path = req.params[0];
    var combinedUrl = moduleBaseUrl + path;
    return combinedUrl;
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