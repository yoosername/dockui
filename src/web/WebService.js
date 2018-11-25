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

  // Add / Remove middleware route (Run before / after Handlers)
  // - this should Build a new Router and add all middleare from 
  // - previous one plus our new one, then switch old for new
  // - possibly do switch only after no new routes modified for
  // -  well deinfed timeout latch
  // Add / Remove Req handler ( GET, POST etc )
  // Add / Remove route (specialized middleware - translates bas routes to plugin routes (Run first))
  // Add / Remove authentication handler (special middleware (Run before other middleware))
  // Add / Remove authorization handler (special middleware (Run before other middleware))

}

module.exports = WebService;
