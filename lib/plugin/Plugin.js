var ModuleService = require("./module/ModuleService");
const EventEmitter = require('events');
var request = require("request");

const HEALTH_MONITOR_INTERVAL = 5000;

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
    this.healthInterval = null;
    this.uptime = null;

    // TODO: Load the plugin.yml and then
    //  - update plugin info
    //  - loadModules
    //  - if no errors then move from INACTIVE state to ACTIVE
    //  - if plugin provides health check endpoint then start monitoring it
    //    - if uptime changes then unload modules, move to INACTIVE state and reload plugin

    this.startHealthMonitor();
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

  startHealthMonitor(){
    // set an interval to monitor the status page of the plugin
    // If uptime has changed then instruct pluginManager to remove and readd this plugin
    var self = this;

    try{

      var healthUrl = `http://${this.network}:${this.port}/status`;
      this.healthInterval = setInterval(function(){
        request(healthUrl, function(error, res, body){
          // status is available so what is the uptime. If its different to existing uptime then reload plugin
          var json = JSON.parse(body);

          if(!error && json && typeof json == "object"){
            var newUptime = parseInt(json.uptime);

            if( self.uptime == null || self.uptime == "undefined" || typeof self.uptime != "number" ){

              self.uptime = newUptime;
              console.log("Plugin ["+self.getKey()+"] uptime set: ", self.uptime);

            }else if( self.uptime < newUptime ){
              console.log("Plugin ["+self.getKey()+"] refreshed with new uptime: ", self.uptime);
              self.uptime = newUptime;
            }

          }

        });
      }, HEALTH_MONITOR_INTERVAL);

    }catch(error){
      console.log("Error starting health monitor: ", error);
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
