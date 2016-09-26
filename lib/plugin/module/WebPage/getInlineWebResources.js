let cheerio = require('cheerio');

module.exports = function(context){


    console.log("getInlineWebResources");

    return new Promise(function(resolve, reject){

      var template = cheerio.load(context.template);

      // first parse out any styles and scripts for later
      if(!context.styles) context.styles = [];
      template("link[rel='stylesheet']").each(function(){
        context.styles.push(template.html(template(this)));
        template(this).remove();
      });
      template("style").each(function(){
        context.styles.push(template.html(template(this)));
        template(this).remove();
      });
      if(!context.scripts) context.scripts = [];
      template("script").each(function(){
        context.scripts.push(template.html(template(this)));
        template(this).remove();
      });

      context.template = template.html();

      resolve(context);

    })


}
