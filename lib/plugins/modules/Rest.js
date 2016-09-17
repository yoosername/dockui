const Module = require("./Module");

class Rest extends Module{

  // TODO: This describes a static resource root and various files to include and exclude
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
