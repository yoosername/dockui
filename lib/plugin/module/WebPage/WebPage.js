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
    this.cachedTemplate = null;
    this.fetchTemplate();
  }

  getPath(){
    return this.path;
  }

  getCachedTemplate(context){

    var self = this;
    var promise;

    return this.fetchTemplate().then(function(template){
      context.template = template;
      return context;
    })

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

    return new Promise(function(resolve, reject){

      self.getCachedTemplate(context)
        .then(getInlineWebResources)
        .then(getModuleWebResources)
        .then(checkAndApplyWebItems)
        .then(checkAndApplyWebFragments)
        .then(checkAndApplyDecorator)
        .then(function(context){
          if(!isDecorator){
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

  fetchTemplate(){

    var self = this;
    var plugin = this.getPlugin();
    var templateUrl = "http://" + plugin.getNetwork() + ":" + plugin.getPort() + this.getPath();

    var updateTemplate = function(){
      return request({
        url: templateUrl,
        json:true,
        fullResponse: false // (default) To resolve the promise with the full response or just the body
      })
    }

    return updateTemplate().then(function(template){
      self.cachedTemplate = template;
      return template;
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
