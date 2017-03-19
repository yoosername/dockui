const Module = require("./Module");
var http = require("http");
const URL = require('url');
const Errors = require('../../web/Errors');

var postHeadersToAuthEndpoint = function(uri, headers){
  return new Promise(function(resolve, reject){

    urlObj = URL.parse(uri);

    http.get({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path : urlObj.path,
      headers : headers
    }, function (res) {
        // Detect a redirect
        if (res.statusCode && (res.statusCode == 301||res.statusCode == 302) && res.headers.location) {
          console.log("[AuthProvider module]: Redirect requested: ", res.statusCode, res.headers.location);
          reject(new Errors.AuthenticationRedirectRequestedError(res.headers.location));
        }else if(res.statusCode && res.statusCode != 200){
          console.log("[AuthProvider module]: Authentication failed");
          reject(new Errors.ProviderCantHandleAuthenticationRequestError());
        }else {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            }).on('end', function () {
                console.log("[AuthProvider module]: Authentication succeeded");
                resolve(data);
            });
        }
    });

  });
}

class AuthProvider extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);
    this.url = descriptor.url;
  }

  getWeight(){
    return this.weight;
  }

  getUri(){
    console.log("URI: ", this.getModuleBaseUrl() + this.url);
    return this.getModuleBaseUrl() + this.url;
  }

  authenticate(req){

    // TODO: Proxy copy of req to providers internal auth endpoint and listen for response.
    // if 200 then Resolve with returned JWT_ACCESS_TOKEN or
    var currentRequestHeaders = req.headers;
    console.log(currentRequestHeaders);
    return postHeadersToAuthEndpoint(this.getUri(), currentRequestHeaders);

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
