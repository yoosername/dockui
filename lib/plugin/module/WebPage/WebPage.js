const Module = require("../Module");
var request = require('requestretry');
let cheerio = require('cheerio');

var getInlineWebResources = require("./getInlineWebResources");
var getModuleWebResources = require("./getModuleWebResources");
var checkAndApplyWebItems = require("./checkAndApplyWebItems");
var checkAndApplyWebFragments = require("./checkAndApplyWebFragments");
var checkAndApplyDecorator = require("./checkAndApplyDecorator");
var applyWebResources = require("./applyWebResources");


class WebPage extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);
    this.path = descriptor.path;
  }

  getPath(){
    return this.path;
  }

  setPath(path){
    this.path = path;
  }

  render(options){

    console.log("Start Render");

    var self = this;
    var isDecorator = options.decorator;
    var pluginManager = self.getPluginManager();

    // There might be an existing context if we are a decorator, so get it or create a new one
    var context = {};
    context.template = "";
    context.pluginManager = pluginManager;
    context.resourceContext = null;
    context.req = options.req;
    context.res = options.res;

    return new Promise(function(resolve, reject){

      self.fetchTemplate(context)
        .then(getInlineWebResources)
        .then(getModuleWebResources)
        .then(checkAndApplyWebItems)
        .then(checkAndApplyWebFragments)
        .then(checkAndApplyDecorator)
        .then(function(context){
          if(!isDecorator){
            console.log("Not a decorator so apply the response headers as well: ", context.responseHeaders);
            Object.keys(context.responseHeaders).forEach(function(key) {
              var val = context.responseHeaders[key];
              options.res.set(key, val);
            });
            console.log("Not a decorator so apply all the web resources now");
            return applyWebResources(context);
          }else{
            return context;
          }
        })
        .then(function(context){
          console.log("Finished Render");
          resolve(context);
        })

    });
  }

  // TODO: Pass original response in as well, so that the headers all make it back in tact
  // because the plugin might want to set cookies etc.

  fetchTemplate(context){

    var self = this;
    var context = context || {};
    var plugin = this.getPlugin();
    var templateUrl = "http://" + plugin.getNetwork() + ":" + plugin.getPort() + this.getPath();

    var requestOptions = {
      method: "GET",
      url: templateUrl,
      fullResponse: true
    }

    if( context && context.req ){
      requestOptions.method = context.req.method;
      requestOptions.headers = context.req.headers;
      // original request is a readstream which isvalid value for request.body
      // If we sent Post data then this is way to forward it on
      requestOptions.body = context.req;
    }

    var updateTemplate = function(){
      console.log("Fetching with options: ", requestOptions);
      return request(requestOptions);
    }

    return updateTemplate().then(function(response){
      context.template = response.body;
      context.responseHeaders = response.headers;
      return context;
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
