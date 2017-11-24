let cheerio = require('cheerio');

module.exports = function(context){

  console.log("[WebPage Module:InjectWebItems] : Injecting web items into webpage");
  var pluginManager = context.getModule().getPluginManager();

  return new Promise(function(resolve, reject){

    var $template = cheerio.load(context.getTemplate());
    var webItemInjectionPoints = $template('[data-webitems]');

    if(webItemInjectionPoints.length > 0){
      webItemInjectionPoints.each(function(index, element){
        // This refers to the current webitem injection point element
        var $this = $template(this);
        var linksToReplace = "";
        // Get a ref to the key of webitems we want to inject here
        var location = $this.data("webitems");
        // remove the data-webitems attr from the template now
        $this.removeAttr("data-webitems");
        // and store it as a template for further use
        var template = $template.html($this);

        //console.log("found web item injection point for location: ", location, " with template ", template);
        // Find all the modules of type webitem with a location of location
        var allWebitems = pluginManager.getModulesByType("webitem");
        if( allWebitems && allWebitems.length > 0 ){
          allWebitems.forEach(function(webitem){
            if(webitem.getLocation() == location){
              // If here then we want to create a link using the template and inject it
              var itemTmpl = template;
              itemTmpl = itemTmpl.replace('{{webitem.link}}', webitem.getLink());
              itemTmpl = itemTmpl.replace('{{webitem.text}}', webitem.getText());
              itemTmpl = itemTmpl.replace('{{webitem.key}}', webitem.getKey());

              linksToReplace += itemTmpl;
            }
          });
        };

        // Now replace the original with the linksFragment
        $this.replaceWith(linksToReplace);

      });

    }

    context.setTemplate($template.html());
    resolve(context);

  })

}