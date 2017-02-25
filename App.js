const MessageService = require('./lib/messaging/MessageService');
const DockerService = require('./lib/docker/DockerService');
const PluginService = require('./lib/plugin/PluginService');
const WebService = require('./lib/web/WebService');

const IGNORE_SERVICES = [/_rabbitmq_/, /_dockui_/];
const DEFAULT_PLUGIN_PORT = 8080;

// TODO: Add some kind of Global Messaging service.
// : Give plugins a module type for declaring a messageListener.
// : those services can then receive messages at some local endpoint.

// TODO: New Plugin lifecycle methods
/**
Notice new container
Try to get descriptor
Read decriptor and try to generate modules
If successful, send status to specified plugin endpoint as POST json e.g.
{
  pluginId : 12345,
  pluginKey : bla,
  status : enabled | disabled | rejected | failed | uninstalled,
  statusReason : "The plugin was enabled successfully",
  modules : [
    {key: "key", enabled: "true"}
    {key: "key", enabled: "false"}
  ],
  messageServer : amqp://gatewayAddress:port,
  messageQueue : <queue is always the plugin key>
}

So a plugin can start and listen on a well known endpoint e.g. /init and then
once it receives a POST it can either do nothing if only contributing UI modules
or if messaging is required the JSON will contain the current endpoint for rabbitMQ
and the associated queue as created by the PluginService at runtime.

Then the plugin can connect to the queue and start listening for messages and broadcasting
messages for other plugins to pick up

The Plugin service will then in future calls update a plugin via messaging to
communicate whether it has been disabled or any modules disabled etc

for example a plugin providing scheduled tasks can now use the queue to listen for other plugins which want to
run a task. Run the task and then broadcast the result.

**/
// TODO: Add a hook mechanism, such that plugins cant receive a POST for various events
// : For example when a plugin is added or removed or various other events
// : Need to add a WebHook module so that plugins can register for events
// : Add a broadcast endpoint for sending custom events to.
// : That way a plugin can broadcast a custom event and other plugins can
// : register to receive the events e.g. via POST or Websockets



// Listen for PluginService events and broadcast them
PluginService.on("plugin:added", function(plugin){
  console.log("Plugin ["+plugin.getKey()+"] loaded successfully from docker container [", plugin.getContainerId(), "] on port ", plugin.getPort());
})

PluginService.on("plugin:removed", function(plugin){
  console.log("Plugin ["+plugin.getKey()+"] was removed successfully from container [", plugin.getContainerId(), "]");
})

PluginService.on("module:added", function(module){
  console.log("Module ["+module.getKey()+"] loaded successfully from plugin [", module.getPlugin().getKey(), "]");
})



// Start the docker service listening for container up and down events
MessageService.start()
.then(function(){
  console.log("Rabbitmq ready and listening on port 5672");

  return DockerService.startMonitor(
    function(container) {

      var network = container.Name;
      var bridged = (network && network == "bridge") ? true : false;
      var port;
      var proceed = true;

      // Dont process any of the ignored services, e.g. this one and rabbitMQ
      IGNORE_SERVICES.forEach(function(regex){
        if( regex.test(network) ){
          proceed = false;
        }
      })

      if( proceed ){
        // Check if the container is using bridged mode or a custom network
        // If Bridged use gateway and host port, if overlay then use service name and private port
        if(bridged){
          port = (container["Ports"][0] && container["Ports"][0]["PublicPort"]) ? container["Ports"][0]["PublicPort"] : DEFAULT_PLUGIN_PORT;
          PluginService.addPlugin(container.Id, port, DockerService.getGateway());
        }else{
          port = (container["Ports"][0] && container["Ports"][0]["PrivatePort"]) ? container["Ports"][0]["PrivatePort"] : DEFAULT_PLUGIN_PORT;
          PluginService.addPlugin(container.Id, port, network);
        }
      }else{
        console.log("Skipping service: ", network, " because its in the IGNORE list");
      }

    },
    function(container) {
      // When container is removed remove all of its modules and the associated Plugin
      PluginService.removePluginsForContainer(container.Id);
    }
  );
})
// Then start the WebService listening on port 80 on the host
.then(function(){
  WebService.start(8080)
})
// Catch any rogue errors.
.catch(function(error){
  console.log("Error initialising the plugin system: ", error);
})
