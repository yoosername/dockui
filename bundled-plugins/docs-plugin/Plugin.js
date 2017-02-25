var express = require('express');
var app = express();

// Plugin descriptor
//app.use('/plugin.json', express.static('plugin.json'));
app.use('/plugin.yml', express.static('plugin.yml'));

// Webpage decorated by the above
app.use('/docs', express.static('templates/docs.html'));

// Serve static files
app.use('/resources', express.static(__dirname + '/resources'));

// Plugin status - dockui uses it to determine wether to reload plugins etc
app.get('/status', function(req, res){
  // Only thing required is return 200 and an uptime datetime
  res.json({uptime: + new Date()})
});

app.listen(8080, function () {
  console.log('Docs plugin listening on port 8080!');
});
