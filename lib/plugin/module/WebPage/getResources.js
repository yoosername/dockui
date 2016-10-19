let cheerio = require('cheerio');

module.exports = function(context){

    console.log("getResources");

    return new Promise(function(resolve, reject){

      try{
        var $template = cheerio.load(context.getTemplate());
        console.log("template object loaded");
        var templateResourceContext = $template('meta[name=includeResourcesFor]').prop("content");
        console.log("template resource context loaded");
        if(templateResourceContext) context.setTemplateResourceContext(templateResourceContext);
        var $decoratorTemplate = cheerio.load(context.getDecoratorTemplate());
        var decoratorResourceContext = $decoratorTemplate('meta[name=includeResourcesFor]').prop("content");
        if(decoratorResourceContext) context.setDecoratorResourceContext(decoratorResourceContext);
        console.log("template resource contexts updated");

        // Parse out the template styles and scripts
        $template("link[rel='stylesheet']").each(function(){
          context.addStyle($template.html($template(this)));
          $template(this).remove();
        });
        $template("style").each(function(){
          context.addStyle($template.html($template(this)));
          $template(this).remove();
        });
        $template("script").each(function(){
          context.addScript($template.html($template(this)));
          $template(this).remove();
        });
        console.log("template resources injected");

        // Parse out the decorator styles and scripts
        $decoratorTemplate("link[rel='stylesheet']").each(function(){
          context.addStyle($decoratorTemplate.html($decoratorTemplate(this)));
          $decoratorTemplate(this).remove();
        });
        console.log("decorator links injected");
        $decoratorTemplate("style").each(function(){
          context.addStyle($decoratorTemplate.html($decoratorTemplate(this)));
          $decoratorTemplate(this).remove();
        });
        console.log("decorator styles injected");
        $decoratorTemplate("script").each(function(){
          context.addScript($decoratorTemplate.html($decoratorTemplate(this)));
          $decoratorTemplate(this).remove();
        });
        console.log("decorator scripts injected");
        console.log("decortor resources loaded");

        context.setTemplate($template.html());
        context.setDecoratorTemplate($decoratorTemplate.html());

        resolve(context);
      }catch(error){
        reject(error);
      }

    });


}
