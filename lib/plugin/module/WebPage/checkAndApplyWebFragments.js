let cheerio = require('cheerio');

module.exports = function(context){


    console.log("checkAndApplyWebFragments");

    return new Promise(function(resolve, reject){

      var $ = cheerio.load(context.template);
      var webFragmentInjectionPoints = $('[data-webfragments]');
      var allFragmentPromises = [];

      if(webFragmentInjectionPoints.length > 0){
        webFragmentInjectionPoints.each(function(index, element){

          // This refers to the current webfragment injection point element
          var $this = $(this);

          // This is an array to hold all the contributing fragments in an dresolve as one
          var fragmentsToReplace = [];

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
                fragmentsToReplace.push(webfragment.render());
              }
            });
          };

          allFragmentPromises.push(Promise.all(fragmentsToReplace).then(function(fragments){
            $this.replaceWith(fragments);
          }));

        });
      }

      Promise.all(allFragmentPromises).then(function(){
        context.template = $.html();
        resolve(context);
      })

    });


}
