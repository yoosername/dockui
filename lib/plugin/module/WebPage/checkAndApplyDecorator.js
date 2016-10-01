let cheerio = require('cheerio');

module.exports = function(context){

    console.log("checkAndApplyDecorator");

    return new Promise(function(resolve, reject){

      // Load the template of the page we are testing for decoration
      var templateObject = cheerio.load(context.template);
      // Get the title for later
      var templateTitle = templateObject('title').text();

      var decoratorModule = null;
      var decoratorTemplate = null;

      // See if this template declares a decorator
      var decoratorModuleKey = templateObject('meta[name=decorator]').prop("content");

      // If decoratorModuleKey then try to get module for the associated key
      if( decoratorModuleKey ){
        decoratorModule = context.pluginManager.getModuleByKey(decoratorModuleKey);
      }

      // If decoratorModule found then get the decorator template from its module
      if( decoratorModule ){
        decoratorModule.render(true).then(function(ctx){
          //console.log("GETS HERRRREEEEEEEE");
          decoratorTemplate = cheerio.load(ctx.template);

          // If there is a decoratorTemplate
          if( decoratorTemplate ){

            // first parse out any styles and scripts for later
            if(!ctx.styles) ctx.styles = [];
            // add main page styles
            if(context.styles) ctx.styles.push(context.styles);
            decoratorTemplate("link[rel='stylesheet']").each(function(){
              ctx.styles.push(decoratorTemplate.html(decoratorTemplate(this)));
              decoratorTemplate(this).remove();
            });
            decoratorTemplate("style").each(function(){
              ctx.styles.push(decoratorTemplate.html(decoratorTemplate(this)));
              decoratorTemplate(this).remove();
            });
            if(!ctx.scripts) ctx.scripts = [];
            // add main page scripts
            if(context.scripts) ctx.scripts.push(context.scripts);
            decoratorTemplate("script").each(function(){
              ctx.scripts.push(decoratorTemplate.html(decoratorTemplate(this)));
              decoratorTemplate(this).remove();
            });

            // Get class from the body of the page being decorated
            var bodyClass = templateObject("body").attr("class");
            // merge the webpage body contents into the decorator template
            decoratorTemplate("[data-content]")
              .removeAttr("data-content")
              .html(templateObject("body").html());

            // Now merge the body classes into the decorating page class
            var decoratorClass = decoratorTemplate("body").attr("class");
            decoratorTemplate("body").attr("class", decoratorClass + " " + bodyClass);

            // Apply decorated template title to the decorator title
            decoratorTemplate("title").text(templateTitle);

            // save the merged template to the context and return
            ctx.template = decoratorTemplate.html();
            resolve(ctx);

          }else{
            reject("Could not load decorator template for module: ", decoratorModule.getKey())
          }

        })
      }else{
        resolve(context);
      }


    })

}
