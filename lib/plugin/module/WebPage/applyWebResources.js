let cheerio = require('cheerio');

module.exports = function(context){


    console.log("applyWebResources");

    return new Promise(function(resolve, reject){

      var $ = cheerio.load(context.template);

      //console.log("styles: ", context.styles);
      //console.log("scripts: ", context.scripts);
      // first get rid of duplicates
      context.styles = context.styles || [];
      context.styles = context.styles.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
      })
      context.scripts = context.scripts || [];
      context.scripts = context.scripts.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
      })

      //console.log("filtered styles: ", context.styles);
      //console.log("filtered scripts: ", context.scripts);

      // For each style and script in the context apply respectively to head and body
      context.styles.forEach(function(style){
        $('head').append(style);
      })

      context.scripts.forEach(function(script){
        $('body').append(script);
      })

      console.log("END checkAndApplyWebResources");
      context.template = $.html();
      resolve(context);

    })


}
