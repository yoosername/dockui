var express = require('express');
var app = express();

// Plugin descriptor
app.use('/plugin.yml', express.static('plugin.yml'));

// Site decorator
app.use('/home', express.static('templates/home.html'));

// Serve static files
app.use('/resources', express.static(__dirname + '/resources'));

app.listen(8080, function () {
  console.log('Decorator plugin app listening on port 8080!');
});
