let cheerio = require('cheerio');
var request = require('request');

module.exports = function(context){

    console.log("getDecorator");
    var pluginManager = context.getModule().getPluginManager();

    return new Promise(function(resolve, reject){

      // Load the template of the page we are testing for decoration
      var templateObject = cheerio.load(context.getTemplate());
      console.log("template object loaded");

      // Set the title
      var originalTitle = templateObject('title').text();
      console.log("template object title loaded");
      context.setTitle(originalTitle);
      console.log("template title set");

      var decoratorModule = null;
      var decoratorTemplate = null;

      // See if this template declares a decorator
      var decoratorModuleKey = templateObject('meta[name=decorator]').prop("content");
      console.log("got decorator module key: ", decoratorModuleKey);

      // If decoratorModuleKey then try to get module for the associated key
      if( decoratorModuleKey ){
        decoratorModule = pluginManager.getModuleByKey(decoratorModuleKey);
        console.log("got decorator module: ", decoratorModule.getKey());
      }

      // If decoratorModule found then get the decorator template from its module
      if( decoratorModule ){
        console.log("decorator module is: ", decoratorModule.getKey());
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
        reject("decorator module not found: " + decoratorModule.getKey());
      }


    })

}
