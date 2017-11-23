let cheerio = require('cheerio');

// Get all webfragments on the base template which should have alfready been decorated by now
module.exports = function(context){

    var pluginManager = context.getModule().getPluginManager();
    console.log("[WebPage Module:InjectWebFragments] : Injecting web fragments into webpage");

    return new Promise(function(resolve, reject){

      var $template = cheerio.load(context.getTemplate());
      var allWebfragments = pluginManager.getModulesByType("webfragment");
      var allFragmentPromises = [];

      $template('[data-webfragments]').each(function(index, element){

        // This refers to the current webfragment injection point element
        var $this = $template(this);

        // This is an array to hold all the contributing fragments in and resolve as one
        var fragmentsToReplace = [];

        // Get a ref to the key of webfragments we want to inject here
        var location = $this.data("webfragments");

        // remove the data-webitems attr from the template now
        $this.removeAttr("data-webfragments");

        //console.log("found web item injection point for location: ", location, " with template ", template);
        // Find all the modules of type webitem with a location of location
        if( allWebfragments && allWebfragments.length > 0 ){
          allWebfragments.forEach(function(webfragment){
            if(webfragment.getLocation() == location){
              fragmentsToReplace.push(webfragment.render());
            }
          });
        };

        allFragmentPromises.push(Promise.all(fragmentsToReplace).then(function(fragments){
          $this.replaceWith(fragments);
        }));

      });

      Promise.all(allFragmentPromises).then(function(){
        context.setTemplate($template.html());
        resolve(context);
      })

    });


}
