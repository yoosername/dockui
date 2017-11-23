let cheerio = require('cheerio');
var types = require("./HTMLResourceTypes");

module.exports = function(context){


    console.log("[WebPage Module:addResources] : Adding resources to processed template");

    return new Promise(function(resolve, reject){

      try{

        var $template = cheerio.load(context.getTemplate());

        // TODO: Need to actually use the associated weight here.
        // At the moment the page scripts are being added before the decorator ones, which wont work.
        //Build dependency graph of styles

        // Hardcode almondjs as it needs to be available to all other resources and should come first
        $template('head').append("<script type='text/javascript' src='/s/almond.js'></script>");
        $template('head').append("<script type='text/javascript' src='/s/jquery.min.js'></script>");

        // Apply all the saved inline resources
        context.getResources({type: types.EXTERNAL_STYLE}).forEach(function(resource){
          $template('head').append(resource.html());
        })
        console.log("[WebPage Module:addResources] : Added external styles to Head");

        context.getResources({type: types.INLINE_STYLE}).forEach(function(resource){
          $template('head').append(resource.html());
        })
        console.log("[WebPage Module:addResources] : Added inline styles to Head");

        context.getResources({type: types.EXTERNAL_SCRIPT}).forEach(function(resource){
          $template('body').append(resource.html());
        })
        console.log("[WebPage Module:addResources] : Added external scripts to Body");

        context.getResources({type: types.INLINE_SCRIPT}).forEach(function(resource){
          $template('body').append(resource.html());
        })
        console.log("[WebPage Module:addResources] : Added inline scripts to Body");

        context.setTemplate($template.html());
        resolve(context);

      }catch(error){
        console.log("[WebPage Module:addResources] : Error adding resources to template: ", error);
        reject(error);
      }

    })


}
