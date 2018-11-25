/**
 * WebService
 * Wraps the intialization, configuration and starting/stopping of a web server
 * and associated routes etc.
 */
class WebService{

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

  // Add middleware (like a servlet filter)
  // - this should Build a new Router and add all middleare from 
  // - previous one plus our new one, then switch old for new
  // - possibly do switch only after no new routes modified for
  // -  well deinfed timeout latch
  // Remove middleware
  // Add handler
  // Remove handler

}

module.exports = WebService;
