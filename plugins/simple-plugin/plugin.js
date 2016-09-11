var express = require('express');
var app = express();

// Plugin descriptor
app.use('/plugin.json', express.static('plugin.json'));

// Site decorator
app.use('/decorator', express.static('templates/decorator.html'));

// Webpage decorated by the above
app.use('/example', express.static('templates/example.html'));

app.listen(8080, function () {
  console.log('Example plugin app listening on port 8080!');
});
