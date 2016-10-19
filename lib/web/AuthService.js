const EventEmitter = require('events');
var PluginService = require('../plugin/PluginService');

var sortByWeight = function(providers){
  return providers.sort(function(a, b){
    // Compare the 2 dates
    if(a.getWeight() < b.getWeight()) return -1;
    if(a.getWeight() > b.getWeight()) return 1;
    return 0;
  });
}

/**
 * CacheService service
 */
 class AuthService extends EventEmitter{
   constructor() {
     super();
   }

   getProviders(){
     var providers = PluginService.getModulesByType("authprovider");
     return sortByWeight(providers);
   }

   authenticate(url, context){
     console.log("Athenticating with Context: ", context);
     var authenticated = false;
     var start = 0;
     var context = context || {};
     // For providers loop through each until one is successful
     return this.trySequentialAuthenticates(url, start, context)
   }

   // context will be modified by the authenticator endpoint and returned
   // context.redirect forces us to redirect
   // context.next means the endpoint couldnt handle the request so try the next one
   // context.authenticated means it was successful so return and continue
   trySequentialAuthenticates(url, id, context){
     var currentId = id;
     var providers = this.getProviders();
     //console.log("providers: ", providers);
     //console.log("trying authenticator: ", providers[currentId]);
     if( providers ){
       return providers[currentId].authenticate(url, context).then(function(context){
         if( context.authenticated || context.redirect){
           return context;
         }else if( context.next ){
           var nextId = currentId++;
           if( providers[nextId] ){
             return trySequentialAuthenticates(url, nextId, context);
           }else{
             return context;
           }
         }
       })
     }else{
       return Promise.resolve({});
     }
   }

 }

module.exports = new AuthService();
