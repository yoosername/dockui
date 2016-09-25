let cheerio = require('cheerio');

module.exports = function(context){

    console.log("checkAndApplyDecorator");

    return new Promise(function(resolve, reject){
      var templateObject = cheerio.load(context.template);
      var templateTitle = templateObject('title').text();

      var decoratorModule = null;
      var decoratorTemplate = null;

      var decoratorModuleKey = templateObject('meta[name=decorator]').prop("content");

      // If decoratorModuleKey then get module for the key
      if( decoratorModuleKey ){
        decoratorModule = context.pluginManager.getModuleByKey(decoratorModuleKey);
      }

      // If decoratorModule then get the template from its module
      if( decoratorModule ){
        decoratorModule.render().then(function(ctx){
          console.log("GETS HERRRREEEEEEEE");
          decoratorTemplate = cheerio.load(ctx.template);

          // If decoratorTemplate then merge the webpage body contents into it and serve it
          if( decoratorTemplate ){
            decoratorTemplate("[data-content]")
              .removeAttr("data-content")
              .html(templateObject("body").html());

            // Apply template title to the decorator title
            decoratorTemplate("title").text(templateTitle);
            ctx.template = decoratorTemplate.html();
            resolve(ctx);
          }else{
            reject("Could not load template for module: ", decoratorModule.getKey())
          }

        })
      }else{
        resolve(context);
      }


    })

}
