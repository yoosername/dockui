const Module = require("./Module");

class WebResources extends Module{

  // TODO: This describes a static resource root and various files to include and exclude
  constructor(containerId, pluginKey, descriptor){
    super(containerId, pluginKey, descriptor);
    this.path = descriptor.path;
    this.includes = descriptor.includes;
    this.excludes = descriptor.excludes;
  }

  getPath(){
    return this.path;
  }

  setPath(path){
    this.path = path;
  }

  valid(){

    var validPath = (this.path && typeof this.path == "string");
    if( validPath && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = WebResources;
