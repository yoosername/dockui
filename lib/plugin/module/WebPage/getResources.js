let cheerio = require('cheerio');

module.exports = function(context){

    console.log("[WebPage Module:getResources] : Attempting to parse existing resources for later");

    return new Promise(function(resolve, reject){

      try{
        var $template = cheerio.load(context.getTemplate());
        var allWebresourceModules = context.getModule().getPluginManager().getModulesByType("webresources");
        var templateResourceContext = $template('meta[name=includeResourcesFor]').prop("content");
        if(templateResourceContext) context.setTemplateResourceContext(templateResourceContext);
        var $decoratorTemplate = cheerio.load(context.getDecoratorTemplate());
        var decoratorResourceContext = $decoratorTemplate('meta[name=includeResourcesFor]').prop("content");
        if(decoratorResourceContext) context.setDecoratorResourceContext(decoratorResourceContext);
        console.log("[WebPage Module:getResources] : resourceContext = %s, decoratorResourceContext = %s", templateResourceContext, decoratorResourceContext);

        // Parse out the template styles and scripts
        var allCSSResourceElements = $template("link[rel='stylesheet'], style, script");
        allCSSResourceElements.each(function(){
          context.addResource($template.html($template(this)), false);
          $template(this).remove();
        });
        console.log("[WebPage Module:getResources] : ("+allCSSResourceElements.length+") css resources parsed and removed from template");

        // Parse out the decorator styles and scripts
        var allScriptResourceElements = $decoratorTemplate("link[rel='stylesheet'], style, script");
        allScriptResourceElements.each(function(){
          context.addResource($decoratorTemplate.html($decoratorTemplate(this)), true);
          $decoratorTemplate(this).remove();
        });
        console.log("[WebPage Module:getResources] : ("+allScriptResourceElements.length+") script resources parsed and removed from template");

        // Fetch all the module added resources too
        // Apply all the module resources based on resourcesFrom context(s)
        allWebresourceModules.forEach(function(resourceModule){

          var isDecoratorResource = (resourceModule.getContext() == decoratorResourceContext) ? true : false;
          var isPageResource = (resourceModule.getContext() == templateResourceContext) ? true : false;

          // Only add resources for the page or the decorator contexts
          if( isPageResource || isDecoratorResource ){
            console.log("[WebPage Module:getResources] : Adding module resources from: ", resourceModule.getKey());
            resourceModule.getResources().forEach(function(resource){
              context.addModuleResource(resourceModule, resource, isDecoratorResource);
            })
          }

        });

        context.setTemplate($template.html());
        context.setDecoratorTemplate($decoratorTemplate.html());

        resolve(context);
      }catch(error){
        console.log("[WebPage Module:getResources] : Error processing resources: ", error);
        reject(error);
      }

    });


}
