let cheerio = require('cheerio');

module.exports = function(context){


    console.log("checkAndApplyWebFragments");

    return new Promise(function(resolve, reject){

      var $ = cheerio.load(context.template);
      var webFragmentInjectionPoints = $('[data-webfragments]');

      if(webFragmentInjectionPoints.length > 0){
        webFragmentInjectionPoints.each(function(index, element){
          // This refers to the current webfragment injection point element
          var $this = $(this);
          // This is the html string we will build from contributing fragments
          var fragmentsToReplace = "";
          // Get a ref to the key of webfragments we want to inject here
          var location = $this.data("webfragments");
          // remove the data-webitems attr from the template now
          $this.removeAttr("data-webfragments");

          //console.log("found web item injection point for location: ", location, " with template ", template);
          // Find all the modules of type webitem with a location of location
          var allWebfragments = context.pluginManager.getModulesByType("webfragment");
          if( allWebfragments && allWebfragments.length > 0 ){
            allWebfragments.forEach(function(webfragment){
              if(webfragment.getLocation() == location){
                webfragment.render().then(function(template){
                  fragmentsToReplace += template;
                });
              }
            });
          };

          // Now replace the original with the linksFragment
          $this.replaceWith(fragmentsToReplace);

        });
      }

      context.template = $.html();
      resolve(context);

    });


}
