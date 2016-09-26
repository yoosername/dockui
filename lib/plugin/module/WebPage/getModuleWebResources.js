let cheerio = require('cheerio');

module.exports = function(context){


    console.log("checkAndApplyModuleWebResources");

    return new Promise(function(resolve, reject){

      // Find out the defined resourceContext if any
      var $ = cheerio.load(context.template);

      var resourceContext = $('meta[name=includeResourcesFor]').prop("content");

      if( resourceContext ){
        // Get all the web resources from each plugin contributing to this context via modules
        var allWebresourceModules = context.pluginManager.getModulesByType("webresources");
        if( allWebresourceModules ){

          if(!context.styles) context.styles = [];
          if(!context.scripts) context.scripts = [];

          allWebresourceModules.forEach(function(resourceModule){

            if( resourceModule.getContext() == resourceContext ){

              resourceModule.getResources().forEach(function(resource){

                if( resource.type == "css"){
                  var href = "/static/" + resourceModule.getPlugin().getKey() + "/" + resourceModule.getKey();
                  href = href + "/" + resource.path;
                  context.styles.push('<link rel="stylesheet" href="'+href+'" media="all">');
                }else if( resource.type == "js"){
                  var src = "/static/" + resourceModule.getPlugin().getKey() + "/" + resourceModule.getKey();
                  src = src + "/" + resource.path;
                  context.scripts.push('<script src="'+src+'"></script>');
                }

                console.log("Added resources for context ("+resourceContext+"): ", resource);
              })
            }

          });

        }

      }

      resolve(context);

    })


}
