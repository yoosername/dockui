var express = require('express');
var app = express();

// Plugin descriptor
app.use('/plugin.yml', express.static('plugin.yml'));

// Site decorator
app.use('/home', express.static('templates/home.html'));

// Serve static files
app.use('/resources', express.static(__dirname + '/resources'));

// Plugin status - dockui uses it to determine wether to reload plugins etc
var status = {uptime: + new Date()};
app.get('/status', function(req, res){
  // Only thing required is return 200 and an uptime datetime
  res.json(status)
});

app.listen(8080, function () {
  console.log('Decorator plugin app listening on port 8080!');
});
