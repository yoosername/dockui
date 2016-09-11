const Module = require("./Module");

class WebPage extends Module{

  constructor(containerId, pluginKey, descriptor){
    super(containerId, pluginKey, descriptor);
    this.path = descriptor.path;
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

module.exports = WebPage;
