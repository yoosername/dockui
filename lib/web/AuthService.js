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

   authenticate(req, res, context){
     console.log("Athenticating with Context: ", context);
     var authenticated = false;
     var start = 0;
     // For providers loop through each until one is successful
     return this.trySequentialAuthenticates(req, res, start, context)
   }

   // context will be modified by the authenticator endpoint and returned
   // context.redirect forces us to redirect
   // context.next means the endpoint couldnt handle the request so try the next one
   // context.authenticated means it was successful so return and continue
   trySequentialAuthenticates(req, res, id, context){
     var currentId = id;
     var providers = this.getProviders();
     console.log("trying authenticator: ", providers[currentId]);
     return providers[currentId].authenticate(req, res, context).then(function(context){
       if( context.authenticated ){
         return context;
       }else if( context.redirect ){
         console.log("Hit redirect with context: ", context);
         res.redirect(context.redirect.url + '?then=' + context.redirect.then);
       }else if( context.next ){
         var nextId = currentId++;
         if( providers[nextId] ){
           return tryAuthenticate(req, res, nextId, context);
         }else{
           console.log("No more authenticators to try, ending here");
           res.redirect("/error?code=401");
         }
       }
     })
   }

 }

module.exports = new AuthService();
