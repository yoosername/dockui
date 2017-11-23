var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
var exphbs  = require('express-handlebars');

var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var nJwt = require('njwt');
var secureRandom = require('secure-random');
var signingKey = secureRandom(256, {type: 'Buffer'}); // Create a highly random byte array of 256 bytes

const EXTERNAL_RELATIVE_LOGIN_URL = "/login";
const DEFAULT_LOGIN_SUCCESS_URL = "/loggedIn";
const JWT_COOKIE_ID = "jwt-access-token";
const DEFAULT_LOGIN_FAILURE_MSG = "Incorrect username or password";



app.use(cookieParser());

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Plugin  descriptor
//app.use('/plugin.json', express.static('plugin.json'));
app.use('/plugin.yml', express.static('plugin.yml'));

// Plugin status - dockui uses it to determine wether to reload plugins etc
var status = {uptime: + new Date()};
app.get('/status', function(req, res){
  // Only thing required is return 200 and an uptime datetime
  res.json(status);
});

// Parses simple request with headers and tries to authenticate the user based on JWT.
// Must return 200+JWT, 301+url, 401, 501
app.get('/authenticate', function(req, res){
  // Only thing required is return 200 and an uptime datetime
  // Check headers for existing ACCESS_TOKEN. If none then redirect user to login
  // If found then decrypt the ACCESS_TOKEN and return it
  res.cookies = res.cookies || [];
  console.log("Access Token: ",res.cookies[JWT_COOKIE_ID]);
  res.redirect(EXTERNAL_RELATIVE_LOGIN_URL);
});

// Serve the login page ( if there is a "next" queryparam then add it as a hidden field in the form )
app.get('/login*', function(req, res){
  console.log("Request method: ", req.method);
  console.log("Request headers: ", req.headers);
  var next = req.query.next || DEFAULT_LOGIN_SUCCESS_URL;
  var msg = req.query.msg || "";
  res.render("login", {
    next : next,
    msg : msg
  });
});

// Parse  the submitted username / password as respond
app.post('/login*', function(req, res){
  console.log("Request method: ", req.method);
  console.log("Request headers: ", req.headers);
  console.log("Request next URL: ", req.body.next);

  var username = req.body.username;
  var password = req.body.password;
  var next = req.body.next || DEFAULT_LOGIN_SUCCESS_URL;

  console.log("Form Auth plugin: username:%s, password:%s, next:%s", username,password,next);

  if( username == "admin" && password == "admin"){
    console.log("Form Auth plugin: username and password are correct, build jwt and redirect");
    var claims = {
      iss: "http://dockui/",  // The URL of your service
      sub: "admin",    // The UID of the user in your system
      scopes: "GLOBAL_ADMIN"
    };
    var jwt = nJwt.create(claims,signingKey);
    res.cookie(EXTERNAL_RELATIVE_LOGIN_URL, jwt, { maxAge: 900000, httpOnly: true });
    res.redirect(next);
  }else{
    res.redirect(EXTERNAL_RELATIVE_LOGIN_URL + "?next=" + next + "&msg=" + DEFAULT_LOGIN_FAILURE_MSG);
  }

});

// Serve the login page ( if there is a "next" queryparam then add it as a hidden field in the form )
app.get('/loggedIn', function(req, res){
  res.render("loginSuccess");
});

app.listen(8080, function () {
  console.log('Form Auth plugin listening on container port 8080');
});
