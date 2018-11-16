/**
 * NoOpWebService
 * Simple Web Service for Testing
 */
class NoOpWebService{

  // Start the web server
  start(){
    "use strict";
    console.log("\n\n[WebService] : Started");
  }

  // Start the web server
  shutdown(){
    "use strict";
    console.log("\n\n[WebService] : Stopping");
  }

}

module.exports = NoOpWebService;
