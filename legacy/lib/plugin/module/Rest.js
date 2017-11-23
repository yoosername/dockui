const Module = require("./Module");

class Rest extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);
    this.base = descriptor.base;
  }

  getBase(){
    return this.base;
  }

  valid(){

    var validBase = (this.base && typeof this.base == "string");
    if( validBase && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = Rest;
