let cheerio = require('cheerio');

module.exports = function(context){

    console.log("getResources");

    return new Promise(function(resolve, reject){

      try{
        var $template = cheerio.load(context.getTemplate());
        var allWebresourceModules = context.getModule().getPluginManager().getModulesByType("webresources");
        console.log("template object loaded");
        var templateResourceContext = $template('meta[name=includeResourcesFor]').prop("content");
        console.log("template resource context loaded");
        if(templateResourceContext) context.setTemplateResourceContext(templateResourceContext);
        var $decoratorTemplate = cheerio.load(context.getDecoratorTemplate());
        var decoratorResourceContext = $decoratorTemplate('meta[name=includeResourcesFor]').prop("content");
        if(decoratorResourceContext) context.setDecoratorResourceContext(decoratorResourceContext);
        console.log("template resource contexts updated");

        // Parse out the template styles and scripts
        $template("link[rel='stylesheet'], style, script").each(function(){
          context.addResource($template.html($template(this)), false);
          $template(this).remove();
        });
        console.log("template resources injected");

        // Parse out the decorator styles and scripts
        $decoratorTemplate("link[rel='stylesheet'], style, script").each(function(){
          context.addResource($decoratorTemplate.html($decoratorTemplate(this)), true);
          $decoratorTemplate(this).remove();
        });
        console.log("decorator scripts injected");
        console.log("decortor resources loaded");

        // Fetch all the module added resources too
        // Apply all the module resources based on resourcesFrom context(s)
        allWebresourceModules.forEach(function(resourceModule){

          var isDecoratorResource = (resourceModule.getContext() == decoratorResourceContext) ? true : false;
          var isPageResource = (resourceModule.getContext() == templateResourceContext) ? true : false;

          // Only add resources for the page or the decorator contexts
          if( isPageResource || isDecoratorResource ){
            console.log("Adding resources for module: ", resourceModule.getKey());
            resourceModule.getResources().forEach(function(resource){
              context.addModuleResource(resourceModule, resource, isDecoratorResource);
            })
          }

        });

        context.setTemplate($template.html());
        context.setDecoratorTemplate($decoratorTemplate.html());

        resolve(context);
      }catch(error){
        console.log(error);
        reject(error);
      }

    });


}
