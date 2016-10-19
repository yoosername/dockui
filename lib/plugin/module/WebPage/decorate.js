let cheerio = require('cheerio');

module.exports = function(context){

    console.log("decorate");

    return new Promise(function(resolve, reject){

      var $template = cheerio.load(context.getTemplate());
      var bodyClass = $template("body").attr("class") || "";
      var $decorator = cheerio.load(context.getDecoratorTemplate());
      var decoratorBodyClass = $decorator("body").attr("class") || "";

      $decorator("[data-content]")
        .removeAttr("data-content")
        .html($template("body").html());

      $decorator("body").attr("class", decoratorBodyClass + " " + bodyClass);
      $decorator("title").text(context.getTitle());

      context.setTemplate($decorator.html());
      resolve(context);

    })

}
