let cheerio = require('cheerio');

module.exports = function(context){


    console.log("checkAndApplyWebResources");

    return new Promise(function(resolve, reject){
      // Find out the defined resourceContext if any
      var $ = cheerio.load(context.template);
      var headElement = $('head');
      var bodyElement = $('body');
      //var resourceContext = $('meta[name=includeResourcesFor]').prop("content");
      console.log("current page defines context: ", context.resourceContext);
      var cssResources = [], jsResources = [];

      if( context.resourceContext ){
        // Get all the css resources from every plugin which wants to contribute to this context
        console.log("there is a resource context: ", context.resourceContext);
        var allWebresourceModules = context.pluginManager.getModulesByType("webresources");
        allWebresourceModules.forEach(function(resourceModule){

          if( resourceModule.getContext() == context.resourceContext ){
            console.log("found resource module for context ("+context.resourceContext+"): ", resourceModule.getKey());
            resourceModule.getResources().forEach(function(resource){
              console.log("found resource", resource);
              if( resource.type == "css"){
                var href = "/static/" + resourceModule.getPlugin().getKey() + "/" + resourceModule.getKey();
                href = href + "/" + resource.path;
                headElement.append("<link rel='stylesheet' href='"+href+"' media='all'>");
              }else if( resource.type == "js"){
                var src = "/static/" + resourceModule.getPlugin().getKey() + "/" + resourceModule.getKey();
                src = src + "/" + resource.path;
                bodyElement.append("<script src='"+src+"'></script>");
              }

              console.log("Added resource for context ("+context.resourceContext+"): ", resource);
            })
          }

        });
        console.log("END checkAndApplyWebResources");
      }

      console.log("END checkAndApplyWebResources");
      context.template = $.html();
      resolve(context);
    })


}
