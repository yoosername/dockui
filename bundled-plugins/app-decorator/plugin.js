var express = require('express');
var app = express();

// Plugin descriptor
app.use('/plugin.json', express.static('plugin.json'));

// Site decorator
app.use('/decorator', express.static('templates/decorator.html'));

// Site decorator
app.use('/home', express.static('templates/home.html'));

app.listen(8080, function () {
  console.log('Decorator plugin app listening on port 8080!');
});
