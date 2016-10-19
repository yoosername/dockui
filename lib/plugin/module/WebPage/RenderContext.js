var getDecorator = require("./getDecorator");
var getResources = require("./getResources");
var decorate = require("./decorate");
var injectWebFragments = require("./injectWebFragments");
var injectWebItems = require("./injectWebItems");
var addResources = require("./addResources");

var filterUnique = function(array){
  return array.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
  })
}

class RenderContext{

  constructor(module){
    this.module = module;
    this.template = null;
    this.templateResourceContext = null;
    this.decoratorTemplate = null;
    this.decoratorResourceContext = null;
    this.styles = [];
    this.scripts = [];
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

  getStyles(){
    return this.styles;
  }

  addStyle(style){
    this.styles.push(style);
    this.styles = filterUnique(this.styles);
  }

  getScripts(){
    return this.scripts;
  }

  addScript(script){
    this.scripts.push(script);
    this.scripts = filterUnique(this.scripts);
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

      console.log("Starting render of module: ", this.getModule().getKey());

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
            console.log("Finished rendering - resolve with context")
            resolve(context.getTemplate());
          })

      });

  }

}

module.exports = RenderContext;
