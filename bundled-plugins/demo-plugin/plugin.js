var express = require('express');
var app = express();
var amqplib = require('amqplib');

// var connection = amqp.createConnection({ host: 'rabbitmq' });
//
// // Wait for connection to become established.
// connection.on('ready', function () {
//   // Use the default 'amq.topic' exchange
//   connection.queue('plugins.demo-plugin', function (q) {
//       // Catch all messages
//       q.bind('#');
//
//       // Receive messages
//       q.subscribe(function (message) {
//         // Print messages to stdout
//         console.log("DEMO PLUGIN RECIEVED MSG:", message);
//       });
//   });
// });

// Plugin descriptor
//app.use('/plugin.json', express.static('plugin.json'));
app.use('/plugin.yml', express.static('plugin.yml'));

// Webpage decorated by the above
app.use('/plugins', express.static('templates/plugins.html'));

// Webpage decorated by the above
app.use('/example', express.static('templates/example.html'));

// Webpage decorated by the above
app.use('/example2', express.static('templates/example2.html'));

// Webfragments
app.use('/fragments', express.static('templates/fragments.html'));

// Serve static files
app.use('/resources', express.static(__dirname + '/resources'));

app.get('/tasks', function (request, response) {
    response.json({tasks: "test"});
});

app.listen(8080, function () {
  console.log('Demo plugin listening on port 8080!');
});
