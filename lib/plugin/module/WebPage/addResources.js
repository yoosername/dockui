let cheerio = require('cheerio');

module.exports = function(context){


    console.log("addResources");

    return new Promise(function(resolve, reject){

      var $template = cheerio.load(context.getTemplate());
      var allWebresourceModules = context.getModule().getPluginManager().getModulesByType("webresources");
      var templateResourceCtx = context.getTemplateResourceContext();
      var decoratorResourceCtx = context.getDecoratorResourceContext();
      console.log("template resource contexts determined");

      // Apply all the saved inline resources
      context.getStyles().forEach(function(style){
        $template('head').append(style);
      })
      console.log("template styles appended");

      context.getScripts().forEach(function(script){
        $template('body').append(script);
      })
      console.log("template scripts appended");

      // Apply all the module resources based on resourcesFrom context(s)
      allWebresourceModules.forEach(function(resourceModule){

        if( resourceModule.getContext() == templateResourceCtx || resourceModule.getContext() == decoratorResourceCtx ){

          console.log("context matches");
          resourceModule.getResources().forEach(function(resource){

            if( resource.type == "css"){
              console.log("css type matched");
              var href = "/static/" + resourceModule.getPlugin().getKey() + "/" + resourceModule.getKey();
              href = href + "/" + resource.path;
              $template('head').append('<link rel="stylesheet" href="'+href+'" media="all">');
              console.log("css type appended");
            }else if( resource.type == "js"){
              console.log("js type matched");
              var src = "/static/" + resourceModule.getPlugin().getKey() + "/" + resourceModule.getKey();
              src = src + "/" + resource.path;
              $template('body').append('<script src="'+src+'"></script>');
              console.log("js type appended");
            }

            console.log("Added module provided resources for contexts");
          })
        }

      });

      console.log("END addWebResources");
      context.setTemplate($template.html());

      resolve(context);

    })


}
