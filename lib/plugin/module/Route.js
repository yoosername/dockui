const Module = require("./Module");

class Route extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);

    this.route = descriptor.route;
    this.path = descriptor.path;
  }

  getRoute(){
    return this.route;
  }

  getPath(){
    return this.path;
  }

  valid(){

    var validRoute = (this.route && typeof this.route == "string");
    var validPath = (this.path && typeof this.path == "string");
    if( validRoute && validPath && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = Route;
