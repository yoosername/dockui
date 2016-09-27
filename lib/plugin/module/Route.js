const Module = require("./Module");

class Route extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);

    this.routes = descriptor.routes;
    this.path = descriptor.path;
  }

  getRoutes(){
    return this.routes;
  }

  getPath(){
    return this.path;
  }

  valid(){

    var validRoutes = (this.routes && typeof this.routes == "array");
    var validPath = (this.path && typeof this.path == "string");
    if( validRoutes && validPath && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = Route;
