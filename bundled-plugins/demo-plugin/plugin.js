var express = require('express');
var app = express();

// Plugin descriptor
app.use('/plugin.json', express.static('plugin.json'));

// Webpage decorated by the above
app.use('/plugins', express.static('templates/plugins.html'));

// Webpage decorated by the above
app.use('/example', express.static('templates/example.html'));

// Webpage decorated by the above
app.use('/example2', express.static('templates/example2.html'));

// Serve static files
app.use('/resources', express.static(__dirname + '/resources'));

app.get('/tasks', function (request, response) {
    response.json({tasks: "test"});
});

app.listen(8080, function () {
  console.log('Demo plugin listening on port 8080!');
});
