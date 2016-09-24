let cheerio = require('cheerio');

module.exports = function() {
  return function(req, res, next) {

    req.on("end", function() {


    });
    next(); // move onto next middleware
  }
}
