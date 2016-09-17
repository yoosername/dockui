const Module = require("./Module");
var request = require('requestretry');
let cheerio = require('cheerio');

var checkAndApplyWebItems = function(template, pluginManager){

  var $ = cheerio.load(template);
  var webItemInjectionPoints = $('[data-webitems]');

  if(webItemInjectionPoints.length > 0){
    webItemInjectionPoints.each(function(index, element){
      // This refers to the current webitem injection point element
      var $this = $(this);
      var linksToReplace = "";
      // Get a ref to the key of webitems we want to inject here
      var location = $this.data("webitems");
      // remove the data-webitems attr from the template now
      $this.removeAttr("data-webitems");
      // and store it as a template for further use
      var template = $.html($this);

      //console.log("found web item injection point for location: ", location, " with template ", template);
      // Find all the modules of type webitem with a location of location
      var allWebitems = pluginManager.getModulesByType("webitem");
      if( allWebitems && allWebitems.length > 0 ){
        allWebitems.forEach(function(webitem){
          if(webitem.getLocation() == location){
            // If here then we want to create a link using the template and inject it
            var itemTmpl = template;
            itemTmpl = itemTmpl.replace('{{webitem.link}}', webitem.getLink());
            itemTmpl = itemTmpl.replace('{{webitem.text}}', webitem.getText());
            itemTmpl = itemTmpl.replace('{{webitem.key}}', webitem.getKey());

            linksToReplace += itemTmpl;
          }
        });
      };

      // Now replace the original with the linksFragment
      $this.replaceWith(linksToReplace);

    });

  }
  return $.html();
}

var getResourceContext = function(template){
  var $ = cheerio.load(template);
  var resourceContext = $('meta[name=includeResourcesFor]').prop("content");
  return resourceContext || null;
}

var checkAndApplyWebResources = function(resourceContext, template, pluginManager){

  // Find out the defined resourceContext if any
  var $ = cheerio.load(template);
  var headElement = $('head');
  var bodyElement = $('body');
  //var resourceContext = $('meta[name=includeResourcesFor]').prop("content");
  console.log("current page defines context: ", resourceContext);
  var cssResources = [], jsResources = [];

  if( resourceContext ){
    // Get all the css resources from every plugin which wants to contribute to this context

    var allWebresourceModules = pluginManager.getModulesByType("webresources");
    allWebresourceModules.forEach(function(resourceModule){
      if( resourceModule.getContext() == resourceContext ){
        //console.log("found resource module for context ("+resourceContext+"): ", resourceModule);
        resourceModule.getResources().forEach(function(resource){

          if( resource.type == "css"){
            var href = "/static/" + resourceModule.getPlugin().getKey() + "/" + resourceModule.getKey();
            href = href + "/" + resource.path;
            headElement.append("<link rel='stylesheet' href='"+href+"' media='all'>");
          }else if( resource.type == "js"){
            var src = "/static/" + resourceModule.getPlugin().getKey() + "/" + resourceModule.getKey();
            src = src + "/" + resource.path;
            bodyElement.append("<script src='"+src+"'></script>");
          }

          console.log("added resource for context ("+resourceContext+"): ", resource);
        })
      }
    })
  }

  return $.html();
}

var checkAndApplyWebPanels = function(template, pluginManager){
  return template;
}

var checkAndApplyDecorator = function(template, pluginManager){

  var templateObject = cheerio.load(template);

  var decoratorModule = null;
  var decoratorTemplate = null;

  var decoratorModuleKey = templateObject('meta[name=decorator]').prop("content");

  // If decoratorModuleKey then get module for the key
  if( decoratorModuleKey ){
    decoratorModule = pluginManager.getModuleByKey(decoratorModuleKey);
  }

  // If decoratorModule then get the template from its module
  if( decoratorModule ){
    decoratorTemplate = cheerio.load(decoratorModule.render());
  }

  // If decoratorTemplate then merge the webpage body contents into it and serve it
  if( decoratorTemplate ){
    decoratorTemplate("[data-content]")
      .removeAttr("data-content")
      .html(templateObject("body").html());
    template = decoratorTemplate.html();
  }

  return template;
}

class WebPage extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);
    this.path = descriptor.path;
    this.cachedTemplate = null;
    var self = this;

    this.fetchTemplate()
    .then(function(template){
      self.cachedTemplate = template;
    });
  }

  getPath(){
    return this.path;
  }

  getCachedTemplate(){
    return this.cachedTemplate;
  }

  setPath(path){
    this.path = path;
  }

  render(){
    var pluginManager = this.getPluginManager();
    var template = this.getCachedTemplate();
    // Do resources before decorator as decorator is its own page
    // and gets resources added seperately, and resource declaration
    // is in the meta which doesnt make it into the decorated page
    var resourceContext = getResourceContext(template);
    template = checkAndApplyWebItems(template, pluginManager);
    template = checkAndApplyWebPanels(template, pluginManager);
    template = checkAndApplyDecorator(template, pluginManager);
    if( resourceContext ){
      template = checkAndApplyWebResources(resourceContext, template, pluginManager);
    }
    return template || "";
  }

  fetchTemplate(){

    var plugin = this.getPlugin();
    var templateUrl = "http://" + plugin.getGateway() + ":" + plugin.getPort() + this.getPath();

    return request({
      url: templateUrl,
      json:true,
      fullResponse: false // (default) To resolve the promise with the full response or just the body
    })

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
