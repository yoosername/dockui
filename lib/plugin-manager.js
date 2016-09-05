const util = require('./util');
const Plugin = require('./models').Plugin;
const PLUGIN_DESCRIPTOR_AVAILABILITY_DELAY = 2000;
const PLUGIN_DESCRIPTOR_NAME = "plugin.json";
const PLUGIN_DESCRIPTOR_DEFAULT_PORT = 8080;
const PLUGIN_DESCRIPTOR_DEFAULT_GATEWAY = "127.0.0.1";

const nodeUtil = require('util');
const EventEmitter = require('events');

/**
 * PluginManager service
 */
 function PluginManager(){
   EventEmitter.call(this);
   this.plugins = [];
   this.gateway = PLUGIN_DESCRIPTOR_DEFAULT_GATEWAY;
 }

 nodeUtil.inherits(PluginManager, EventEmitter);

 PluginManager.prototype.addPlugin = function(port){
   var descriptorServicePort = port;
   var self = this;

   fetchRemotePluginDescriptor(
     self.gateway,
     descriptorServicePort,
     function(error, descriptor){
       if(error){
         console.log("Error loading plugin descriptor");
       }
       var plugin = new Plugin(descriptor);
       self.plugins.push(plugin);
       self.emit('plugin:added', plugin);
     }
   );
 }

 PluginManager.prototype.setGateway = function(gateway){
   this.gateway = gateway;
 }

 PluginManager.prototype.getPlugins = function(){
   return this.plugins;
 }

 exports.getInstance = function(){
   return new PluginManager();
 }

/**
 * Get plugin json from from running container e.g. http://gateway:publicPort/plugin.json
 * @param gateway : String
 * @param port : String
 * @param successCb : Function
 * @param errorCb : Function
 */
function fetchRemotePluginDescriptor(gateway, port, callback) {
  gateway = (typeof gateway == "string" && gateway != "undefined") ? gateway.replace(/(\r\n|\n|\r)/gm,"") : PLUGIN_DESCRIPTOR_DEFAULT_GATEWAY;
  port = port || PLUGIN_DESCRIPTOR_DEFAULT_PORT;
  callback = (typeof callback == "function") ? callback : function(){return;} ;

  var pluginDescriptorUrl = `http://${gateway}:${port}/${PLUGIN_DESCRIPTOR_NAME}`;
  //console.info("Attempting to Fetch plugin descriptor from: ", pluginDescriptorUrl);

  util.tryUntilSuccess({
    hostname: gateway,
    path: '/' + PLUGIN_DESCRIPTOR_NAME,
    port: port,
    method: 'GET',
  }, function(descriptor){
      //console.log("validating: ", descriptor);
      if(descriptor.key) return true;
      return false;
  }, function(error, body){
      //console.log("gets here: ", error, body);
      if(error){
        callback(error);
      }
      callback(null, body);
  });

}

exports.fetchRemotePluginDescriptor = fetchRemotePluginDescriptor;
