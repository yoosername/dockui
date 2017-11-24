var express = require('express');
var app = express();
var amqplib = require('amqplib');

// Plugin descriptor
//app.use('/plugin.json', express.static('plugin.json'));
app.use('/plugin.yml', express.static('plugin.yml'));

// Webpage decorated by the above
app.use('/plugins', express.static('templates/plugins.html'));

// Webpage decorated by the above
app.use('/tour', express.static('templates/tour.html'));

// Webfragments
app.use('/fragments', express.static('templates/fragments.html'));

// Serve static files
app.use('/resources', express.static(__dirname + '/resources'));

app.get('/tasks', function (request, response) {
    response.json({tasks: "test"});
});

// Plugin status - dockui uses it to determine wether to reload plugins etc
var status = {uptime: + new Date()};
app.get('/status', function(req, res){
  // Only thing required is return 200 and an uptime datetime
  res.json(status)
});

app.listen(8080, function () {
  console.log('Demo plugin listening on port 8080!');
});