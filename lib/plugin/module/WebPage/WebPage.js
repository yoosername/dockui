const Module = require("../Module");
var RenderContext = require("./RenderContext");
const URL = require('url');
var is = require('type-is');
var request = require("request");
var _ = require("underscore");
var WebErrors = require("../../../web/Errors");

const DISCARD_API_HEADERS = ["content-length"];

var isEmpty = function(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

class WebPage extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);
    this.path = descriptor.path;
  }

  getPath(){
    return this.path;
  }

  getUrl(){
    var plugin = this.getPlugin();
    var url = "http://" + plugin.getNetwork() + ":" + plugin.getPort() + this.getPath();
    return url;
  }

  // Take the passed in request and proxy it to the module api then
  // render the resulting template and return the ammended response
  proxy(req, res){

    console.log("[WebPage Module] : user requested : ", req.url);
    var self = this;

    return new Promise(function(resolve, reject){

        var apiRequestOptions = {
          url: self.getUrl(),
          method: req.method.toLowerCase(),
          followRedirect: false
        };
        // If query params then add them to the transformed url
        if(! isEmpty(req.query)){
          var url = URL.parse(self.getUrl());
          url.query = req.query;
          var urlFmt = url.format(url);
          apiRequestOptions.url = urlFmt;
          console.log("[WebPage Module] : Found Query params (%s) so add to container url: %s",JSON.stringify(req.query), urlFmt);
        }
        var apiRequest;
        var context = new RenderContext(self);

        // If the req has a body, pipe it into the proxy request
        if (is.hasBody(req)) {
          apiRequest = req.pipe(request(apiRequestOptions));
        } else {
          apiRequest = request(apiRequestOptions);
        }

        // If there is an error fetching the request then reject the promise
        apiRequest.on('error', function(err) {
          return reject(err);
        });

        // wait for response and if status code not 200 then reject promise
        apiRequest.on('response', function(resp) {

          // If get redirect then just redirect the request
          if( (resp.statusCode == 301 || resp.statusCode == 302) && resp.headers.location ){
            console.log("[WebPage Module] : Caught Redirect, throwing AuthenticationRedirectRequestedError");
            return reject(new WebErrors.AuthenticationRedirectRequestedError(resp.headers.location));
          }

          // If were not a decorator and get error then pipe it directly
          if (resp.statusCode >= 400) {
            console.log("[WebPage Module] : Error fetching template : code : ", resp.statusCode);
            return reject("Errorcode from api: " + resp.statusCode);
          }

          // Add response headers to the global response
          for (var key in resp.headers) {
            if (_.includes(DISCARD_API_HEADERS, key) === false) {
              res.set(key, resp.headers[key]);
            }
          }

          // Get the actual Template so we can parse it.
          var template = "";
          resp.on('data', function (chunk) {
            template += chunk;
          });

          resp.on('end', function () {
            context.setTemplate(template);
            context.render().then(function(tmpl){
              //console.log("about to resolve WebPage with rendered template: ", tmpl);
              return resolve(tmpl);
            })
          });

        });

    });

  }

  valid(){

    var validPath = (this.path && typeof this.path == "string");
    if( validPath && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = WebPage;
