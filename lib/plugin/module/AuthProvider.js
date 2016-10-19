const Module = require("./Module");

class AuthProvider extends Module{

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

  authenticate(url, context){
    // TODO: THis is just a fake authenticate method which auto assumes auth and redirects
    return new Promise(function(resolve, reject){
      context.redirect = {
        url : "/login",
        then : url
      };
      resolve(context);
    });
  }

  valid(){

    var validPath = (this.path && typeof this.path == "string");
    var validWeight = (this.weight && typeof this.weight == "number");
    if( validPath && validWeight && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = AuthProvider;
