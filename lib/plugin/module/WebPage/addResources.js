let cheerio = require('cheerio');
var types = require("./HTMLResourceTypes");

module.exports = function(context){


    console.log("addResources");

    return new Promise(function(resolve, reject){

      try{

        var $template = cheerio.load(context.getTemplate());
        console.log("template resource contexts determined");

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
        console.log("template external styles appended to head");

        context.getResources({type: types.INLINE_STYLE}).forEach(function(resource){
          $template('head').append(resource.html());
        })
        console.log("template inline styles appended to head");

        context.getResources({type: types.EXTERNAL_SCRIPT}).forEach(function(resource){
          $template('body').append(resource.html());
        })
        console.log("template external scripts appended");

        context.getResources({type: types.INLINE_SCRIPT}).forEach(function(resource){
          $template('body').append(resource.html());
        })
        console.log("template inline scripts appended");


        console.log("END addWebResources");
        context.setTemplate($template.html());

        resolve(context);

      }catch(error){
        console.log(error);
        reject(error);
      }

    })


}
