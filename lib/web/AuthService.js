const EventEmitter = require('events');
var PluginService = require('../plugin/PluginService');

var Errors = require("./Errors");

const AUTH_PROVIDER_TYPE = "authprovider";

var sortByWeight = function(providers){
  return providers.sort(function(a, b){
    if(a.getWeight() < b.getWeight()) return -1;
    if(a.getWeight() > b.getWeight()) return 1;
    return 0;
  });
}

/**
 * AuthService service
 */
 class AuthService extends EventEmitter{
   constructor() {
     super();
   }

   // Get a list of available providers ( sorted by weight )
   getProviders(){
     var providers = PluginService.getModulesByType(AUTH_PROVIDER_TYPE);
     return sortByWeight(providers);
   }

   testUserHasScopes(req){
     return new Promise(function(resolve, reject){
       //resolve(true);
       reject(new Errors.UserNotAuthenticatedError());
       //reject(new Errors.UserMissingRequiredScopesError());
     });
   }
   // Authentication entrypoint
   // delegates to the auth modules in order
   // auth modules can authenticate, redirect or pass to next module
   // if all modules are done then the authentication fails.
   // TODO: authenticate should simply take req and then
   //       -  if there isnt any providers then return 501 - not implemented
   //       - foreach authProvider module
   //       - proxy req to its auth endpoint
   //       - wait for reply. then based on reply do the following:
   //       -   200 + JWT_ACCESS_TOKEN = user is authenticated and we have their JWT so add it to
   //       -     the reponse headers and continue
   //       -   301 + uri = provider requires the user to visit a login page so redirect the request now
   //       -   401 = user was authenticated but access was explicitly denied
   //       -   501 = this provider cannot satisfy the request so try another one
   //       -   anything else = send a 500 to the client to indicate there was unknown server error
   authenticate(req){
     console.log("Attempting to Authenticate request");
     var providerId = 0;
     return authenticateByProvider(req, providerId, this.getProviders());
   }

 }

 var authenticateByProvider = function(req, providerId, providers){
   var currentProviderId = providerId;

   return new Promise(function(resolve, reject){

       if( providers ){

         console.log("Trying Auth provider %d of %d", currentProviderId+1, providers.length);
         providers[currentProviderId].authenticate(req)
            .then(function(val){
              resolve(val);
            })
            .catch(function(error){
              if( error instanceof Errors.UserAuthenticationFailedError ){
                reject(error);
              }
              if( error instanceof Errors.AuthenticationRedirectRequestedError ){
                reject(error);
              }
              else if( error instanceof Errors.ProviderCantHandleAuthenticationTypeError ){
                var nextProviderId = currentProviderId++;
                if( providers[nextProviderId] ){
                  resolve( authenticateByProvider(req, nextProviderId) );
                }else{
                  // No more to try so reject with error
                  reject(new Errors.NoAuthenticationProvidersCanHandleRequestError());
                }
              }
              else{
                console.log("Unknown Authentication error", error);
                reject(error);
              }
            });

         // TODO use the custom ERROR reject trick to handle different scenarios.
       }else{
         reject(new Errors.NoAuthenticationProvidersFoundError());
       }

    });
 }

module.exports = new AuthService();
