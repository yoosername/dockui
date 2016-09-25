const Module = require("../Module");
var request = require('requestretry');
var getResourceContext = require("./getResourceContext");
var checkAndApplyWebItems = require("./checkAndApplyWebItems");
var checkAndApplyWebResources = require("./checkAndApplyWebResources");
var checkAndApplyWebFragments = require("./checkAndApplyWebFragments");
var checkAndApplyDecorator = require("./checkAndApplyDecorator");

// TODO: Add a switch for caching pages
// TODO: so that in dev mode it always gets the latest from the plugin in realtime
// TODO: Then the nodemon watcher stuff inside the plugin will work for fast dev

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
    // TODO: Return a Promise instead and resolve with either the cached version
    // TODO: or the newly fetched version if in dev mode.
    var self = this;
    return new Promise(function(resolve, reject){
      context.template = self.cachedTemplate;
      return resolve(context);
    });
  }

  setPath(path){
    this.path = path;
  }

  render(){

    console.log("Start Render");

    var self = this;
    return new Promise(function(resolve, reject){

      var pluginManager = self.getPluginManager();
      var context = {
        template: "",
        pluginManager: pluginManager,
        resourceContext: null
      };
      self.getCachedTemplate(context)
        .then(getResourceContext)
        .then(checkAndApplyWebItems)
        //.then(checkAndApplyWebFragments)
        .then(checkAndApplyDecorator)
        .then(checkAndApplyWebResources)
        .then(function(context){
          console.log("Finish Render");
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

    updateTemplate().then(function(template){
      self.cachedTemplate = template;
    });

    // TODO: If Dev mode then set an Interval to refetch the template

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
