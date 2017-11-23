let cheerio = require('cheerio');
var request = require('request');

module.exports = function(context){

    console.log("[WebPage Module:getDecorator] : Processing template decorator");
    var pluginManager = context.getModule().getPluginManager();

    return new Promise(function(resolve, reject){

      // Load the template of the page we are testing for decoration
      var templateObject = cheerio.load(context.getTemplate());

      // Set the title
      var originalTitle = templateObject('title').text();
      context.setTitle(originalTitle);
      console.log("[WebPage Module:getDecorator] : Setting processed template title to: ", originalTitle);

      var decoratorModule = null;
      var decoratorTemplate = null;

      // See if this template declares a decorator
      var decoratorModuleKey = templateObject('meta[name=decorator]').prop("content");

      // If decoratorModuleKey then try to get module for the associated key
      if( decoratorModuleKey ){
        console.log("[WebPage Module:getDecorator] : Template declares a decorator attempting to find module by key: ", decoratorModuleKey);
        decoratorModule = pluginManager.getModuleByKey(decoratorModuleKey);
      }

      // If decoratorModule found then get the decorator template from its module
      if( decoratorModule ){
        console.log("[WebPage Module:getDecorator] : Successfully loaded Decorator module with key: ", decoratorModule.getKey());
        // Fetch the decorator template and return it
        request(decoratorModule.getUrl(), function (error, response, body) {
          if (!error && response.statusCode == 200) {
            context.setDecoratorTemplate(body);
            resolve(context);
          }else{
            reject("error fetching decorator template for module: " + decoratorModule.getKey());
          }
        })

      }else{
        reject("decorator module not found with key: ", decoratorModuleKey);
      }


    })

}
