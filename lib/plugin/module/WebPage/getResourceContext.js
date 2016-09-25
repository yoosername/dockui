let cheerio = require('cheerio');

module.exports = function(context){

    console.log("getResourceContext");

    return new Promise(function(resolve, reject){
      var $ = cheerio.load(context.template);
      context.resourceContext = $('meta[name=includeResourcesFor]').prop("content");
      resolve(context);
    })

}
