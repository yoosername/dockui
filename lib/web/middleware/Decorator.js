module.exports = function() {
  return function(req,res,next){


    // TODO: Move Page Decoration from WebPage.js into here

    console.log("decorator middleware fired");

    req.on("end", function() {
      // Do the page decoration stuff here
      console.log("Page response will be decorated here");
    });

    next(); // move onto next middleware

  }
}
