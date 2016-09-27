module.exports = function() {
  return function(req,res,next){

    // TODO: Add PKI auth middleware
    //  It should verify the user and simply add UserInfo into every request
    //  If a requst is proxied then the backend simply specifies whether it requires
    //  aLoggedInUser or something, if it gets called it can pull user info from the headers.

    console.log("This is where the Authentictor will fire");
    next();
  }
}
