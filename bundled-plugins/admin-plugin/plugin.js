var express = require('express');
var app = express();

// Plugin descriptor
//app.use('/plugin.json', express.static('plugin.json'));
app.use('/plugin.yml', express.static('plugin.yml'));

// Webpage decorated by the above
app.use('/admin', express.static('templates/admin.html'));
app.use('/plugin', express.static('templates/plugin.html'));

// Serve static files
app.use('/resources', express.static(__dirname + '/resources'));

app.listen(8080, function () {
  console.log('Admin plugin listening on port 8080!');
});
