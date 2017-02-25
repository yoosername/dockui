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

  // TODO: make a request to a remote endpoint to test for auth
  // TODO: possibly forward a copy of the original request so endpoint can test headers etc
  authenticate(url, context){
    // TODO: This is just a fake authenticate method which auto assumes auth and redirects to login page
    // TODO: Need to work out how to do delegated auth properly
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
