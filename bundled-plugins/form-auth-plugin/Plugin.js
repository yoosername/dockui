var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var app = express();

// TODO: Add ability to disable and enable discovered plugins

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Plugin descriptor
//app.use('/plugin.json', express.static('plugin.json'));
app.use('/plugin.yml', express.static('plugin.yml'));

// Webpage decorated by the above
app.all('/login*', function(req, res){
  console.log("Request method: ", req.method);
  console.log("Request body: ", req.body);
  console.log("Request headers: ", req.headers);
  res.sendFile(path.join(__dirname, './templates', 'login.html'));
});

app.listen(8080, function () {
  console.log('Form Auth plugin listening on port 8080!');
});
