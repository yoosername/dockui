var express = require('express');
var app = express();
var MessageService = require("./lib/messaging/MessageService");

// TODO: Add ability to disable and enable discovered plugins

// Plugin descriptor
//app.use('/plugin.json', express.static('plugin.json'));
app.use('/plugin.yml', express.static('plugin.yml'));

// Webpage decorated by the above
app.use('/admin', express.static('templates/admin.html'));
app.use('/plugin', express.static('templates/plugin.html'));

// Serve a JSON endpoint for PluginManager Orchestration
// TODO : use Message queue to submit plugin stop / start etc
app.get('/rest/api/1.0/plugins/:id/:action', function (req, res) {

  var pluginId = req.params.id;
  var action = req.params.action;
  console.log("requested ", action, "for plugin ", pluginId);

  MessageService.sendMessage(JSON.stringify({
    "type" : "pluginLifecycleHook",
    "action" : action,
    "plugin" : pluginId
  }));

  res.send(JSON.stringify({
    "plugin" : pluginId,
    "action" : action
  }));
});

// Plugin status - dockui uses it to determine wether to reload plugins etc
var status = {uptime: + new Date()};
app.get('/status', function(req, res){
  // Only thing required is return 200 and an uptime datetime
  res.json(status)
});

// Serve static files
app.use('/resources', express.static(__dirname + '/resources'));

app.listen(8080, function () {
  console.log('Admin plugin listening on port 8080!');
});

MessageService.sendMessage(JSON.stringify({
  type : "pluginLifecycle",
  status : "started"
}));
MessageService.start();
