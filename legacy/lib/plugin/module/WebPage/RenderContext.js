var getDecorator = require("./getDecorator");
var getResources = require("./getResources");
var decorate = require("./decorate");
var injectWebFragments = require("./injectWebFragments");
var injectWebItems = require("./injectWebItems");
var addResources = require("./addResources");
var HTMLResource = require("./HTMLResource");
var HTMLResourceCollection = require("./HTMLResourceCollection");
var types = require("./HTMLResourceTypes");

class RenderContext{

  constructor(module){
    this.module = module;
    this.template = null;
    this.templateResourceContext = null;
    this.decoratorTemplate = null;
    this.decoratorResourceContext = null;
    this.resources = new HTMLResourceCollection();
    this.title = "Title not set";
  }

  getModule(){
    return this.module;
  }

  getTemplate(){
    return this.template;
  }

  setTemplate(template){
    this.template = template;
  }

  getTemplateResourceContext(){
    return this.templateResourceContext;
  }

  setTemplateResourceContext(context){
    this.templateResourceContext = context;
  }

  getDecoratorTemplate(){
    return this.decoratorTemplate;
  }

  setDecoratorTemplate(template){
    this.decoratorTemplate = template;
  }

  getDecoratorResourceContext(){
    return this.decoratorResourceContext;
  }

  setDecoratorResourceContext(context){
    this.decoratorResourceContext = context;
  }

  addResource(html, isDecoratorResource){
    var resource = new HTMLResource({isDecoratorResource: isDecoratorResource})
    resource.parseHtml(html);
    this.resources.addResource(resource);
  }

  addModuleResource(m, resource, isDecoratorResource){

    var resource = new HTMLResource({
      isDecoratorResource: isDecoratorResource,
      type: (resource.type == "css") ? types.EXTERNAL_STYLE : types.EXTERNAL_SCRIPT,
      dependencies: (resource.requires) ? resource.requires : [],
      ref: "/static/" + m.getPlugin().getKey() + "/" + m.getKey() + "/" + resource.path
    })

    this.resources.addResource(resource);

  }

  getResources(search){
    return this.resources.getResources(search);
  }

  getTitle(){
    return this.title;
  }

  setTitle(title){
    this.title = title;
  }

  render(){

      var self = this;

      // When we are called we should have a template by now. If not then endpoint
      if(!this.getTemplate()){
        return Promise.resolve("No base template to render");
      }

      console.log("[WebPage Module:RenderContext] : Starting render of module: ", this.getModule().getKey());

      return new Promise(function(resolve, reject){

        // We should have the returned base template so just do the rest here
        getDecorator(self)
          .then(getResources)
          .then(decorate)
          // after here we work solely on the template which has already been decorated
          .then(injectWebFragments)
          .then(injectWebItems)
          .then(addResources)
          .then(function(context){
            console.log("[WebPage Module:RenderContext] : Finished rendering - resolve with context");
            resolve(context.getTemplate());
          })
          .catch(function(error){
            console.log("[WebPage Module:RenderContext] : Error processing web page for module: ", this.getModule().getKey());
          })

      });

  }

}

module.exports = RenderContext;
