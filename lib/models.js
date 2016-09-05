var modules = require('./modules');

/**
 * Plugin model
 */
 function Plugin(descriptor){
   this.modules = [];
   this.name = descriptor.name;
   this.key = descriptor.key;
   self = this;

   descriptor.modules.forEach(function(module){
     self.modules.push(new PluginModule(module));
   });
 }

 Plugin.prototype.getName = function(){
   return this.name;
 }

 Plugin.prototype.getKey = function(){
   return this.key;
 }

 /**
  * PluginModule model
  */
  function PluginModule(descriptor){
    this.type = descriptor.type;
    var decorated = decorateModuleForType(this, descriptor.data);
    return decorated;
  }

  function decorateModuleForType(module, data){
    var ModuleDecoratorFactory = modules.getDecoratorFactory(module.type);
    var ModuleDecorator = ModuleDecoratorFactory.instanceOf(module);
    if(ModuleDecorator == null){
      console.log("No decorator found of type: ", module.type);
      return null;
    }
    ModuleDecorator.decorate(data);
    return module;
  }

 exports.Plugin = Plugin;
