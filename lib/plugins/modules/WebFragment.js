const Module = require("./Module");

class WebFragment extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);
    this.path = descriptor.path;
    this.weight = descriptor.weight;
  }

  getPath(){
    return this.path;
  }

  getWeight(){
    return this.weight;
  }

  valid(){

    var validPath = (this.path && typeof this.path == "string");
    var validWeight = (this.weight && typeof this.weight == "integer");
    if( validPath && validWeight && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = WebFragment;
