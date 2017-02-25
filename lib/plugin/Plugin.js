var ModuleService = require("./module/ModuleService");
const EventEmitter = require('events');
var request = require("request");
var states = require("./PluginStates");
const yaml = require('js-yaml');
var requestretry = require('requestretry');

const PLUGIN_DESCRIPTOR_AVAILABILITY_DELAY = 2000;
const PLUGIN_JSON_DESCRIPTOR_NAME = "plugin.json";
const PLUGIN_YAML_DESCRIPTOR_NAME = "plugin.yml";
const PLUGIN_DESCRIPTOR_DEFAULT_PORT = 8080;

const HEALTH_MONITOR_INTERVAL = 5000;

class Plugin extends EventEmitter {
  constructor(pluginManager, network, port, containerId) {
    super();
    this.pluginManager = pluginManager;
    this.network = network;
    this.port = port;
    this.modules = [];
    this.pluginDescriptor = null;
    this.containerId = containerId;
    this.name = null;
    this.key = null;
    this.healthInterval = null;
    this.uptime = null;
    this.state = states.INACTIVE;

    var plugin = this;

    // When we add a module let the PluginManager know
    plugin.on("module:added", function(module){
      plugin.getPluginManager().emit("module:added", module);
    });

    // Load the plugin.yml
    this.init();

  }

  init(){
    var plugin = this;
    loadRemoteConfig(this.network, this.port)
    .then(function(config){
      // activate the plugin
      plugin.activate(config);
    })
    .then(function(){
      // start health monitor
      plugin.startHealthMonitor();
    })
    .catch(function(error){
      // any errors deactivate the plugin
      plugin.deactivate("Cant process config for plugin container with id (", containerId, ") - deactivating");
    });
  }

  activate(config){
    // We got config so update the plugin and trigger event
    if(config){
      this.pluginDescriptor = config;
      this.name = config.name;
      this.key = config.key;
      this.loadModules();
      this.state = states.ACTIVE;
    }else{
      this.deactivate("Cant process config for plugin container with id (" + containerId + ")");
    }

  }

  deactivate(reason){
    console.log("Deactivating plugin, reason = ", reason);
    this.state = states.DEACTIVATED;
    this.stopHealthMonitor();
    this.unLoadModules();
    this.emit('plugin:deactivated', reason);
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

  unLoadModules(){
    this.modules = [];
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
              self.deactivate("Plugin ["+self.getKey()+"] restarted with new uptime: " + self.uptime);
              self.init();
              self.uptime = newUptime;
            }

          }

        });
      }, HEALTH_MONITOR_INTERVAL);

    }catch(error){
      console.log("Error starting health monitor: ", error);
    }
  }

  stopHealthMonitor(){
    clearInterval(this.healthInterval);
    this.healthInterval = null;
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


/**
 * Get plugin json/yaml from from running container e.g. http://gateway:publicPort/plugin.json
 * @param gateway : String
 * @param port : String
 */
function loadRemoteConfig(gateway, port) {
  gateway = (typeof gateway == "string" && gateway != "undefined") ? gateway.replace(/(\r\n|\n|\r)/gm,"") : PLUGIN_DESCRIPTOR_DEFAULT_GATEWAY;
  port = port || PLUGIN_DESCRIPTOR_DEFAULT_PORT;

  var pluginJSONDescriptorUrl = `http://${gateway}:${port}/${PLUGIN_JSON_DESCRIPTOR_NAME}`;
  var pluginYAMLDescriptorUrl = `http://${gateway}:${port}/${PLUGIN_YAML_DESCRIPTOR_NAME}`;
  console.log("Attempting to Fetch plugin descriptor from: ", pluginJSONDescriptorUrl);

  return requestretry({
    url: pluginJSONDescriptorUrl,
    json:true,
    fullResponse: false // (default) To resolve the promise with the full response or just the body
  })
  .then(function(body){
    if(typeof body != "object"){
      console.log("Cannot find "+PLUGIN_JSON_DESCRIPTOR_NAME+" so attempting to Fetch plugin descriptor from: ", pluginYAMLDescriptorUrl);
      return requestretry({
        url: pluginYAMLDescriptorUrl,
        json:false,
        fullResponse: false // (default) To resolve the promise with the full response or just the body
      })
    }else{
      return body;
    }
  })
  .then(function(config){
    // If descriptor is Yaml then parse into json first;
    if( typeof config !='object' ){
      console.log("Config might be Yaml, trying to process it");
      try {
         config = yaml.safeLoad(config);
         //console.log(config);
       } catch (e) {
         //console.log(e);
       }
    }
    return config;
  })
  .catch(function(error){
    console.log("something went wrong: ", error);
  })

}
