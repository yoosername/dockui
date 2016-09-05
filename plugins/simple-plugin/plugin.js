var express = require('express');
var app = express();

app.use('/plugin.json', express.static('plugin.json'));

app.listen(8080, function () {
  console.log('Example plugin app listening on port 8080!');
});
