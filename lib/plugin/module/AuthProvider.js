const Module = require("./Module");

var nJwt = require('njwt');
var secureRandom = require('secure-random');
var signingKey = secureRandom(256, {type: 'Buffer'}); // Create a highly random byte array of 256 bytes
var claims = {
  iss: "http://myapp.com/",  // The URL of your service
  sub: "testuser",    // The UID of the user in your system
  scopes: "APPLICATION_ACCESS, ADMIN_ACCESS"
}

var jwtTestUser = nJwt.create(claims,signingKey);

class AuthProvider extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);
  }

  getWeight(){
    return this.weight;
  }

  authenticate(req){

    // TODO: Proxy copy of req to providers internal auth endpoint and listen for response.
    // if 200 then Resolve with returned JWT_ACCESS_TOKEN or
    // 301 reject(new Errors.AuthenticationRedirectRequestedError())
    // 501 reject(new Errors.ProviderCantHandleAuthenticationTypeError())
    // 401 reject(new Errors.UserAuthenticationFailedError())

    return new Promise(function(resolve, reject){
      return resolve(true);
    });

  }

  valid(){

    var validPath = (this.path && typeof this.path == "string");
    var validWeight = (this.weight && typeof this.weight == "number");
    if( validPath && validWeight && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = AuthProvider;
