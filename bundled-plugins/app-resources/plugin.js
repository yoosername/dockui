var express = require('express');
var app = express();

// Plugin descriptor
app.use('/plugin.json', express.static('plugin.json'));

// Serve static files
app.use('/resources', express.static(__dirname + '/resources'));

app.listen(8080, function () {
  console.log('Resources plugin listening on port 8080!');
});
