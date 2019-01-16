const  {
  WEBSERVICE_STARTING_EVENT,
  WEBSERVICE_STARTED_EVENT,
  WEBSERVICE_SHUTTING_DOWN_EVENT,
  WEBSERVICE_SHUTDOWN_EVENT
} = require("../constants/events"); 

const  {
  validateShapes
} = require("../util/validate");

/**
 * @description Wraps the intialization, configuration and starting/stopping of a web server
 *              and associated routes etc.
 */
class WebService{

  /**
   * @argument {EventService} eventService The EventService to use for web events
   */
  constructor(eventService){
    this.running = false;

    validateShapes([
      {"shape":"EventService","object":eventService}
    ]);

    this.eventService = eventService;
  }

  /**
   * @description initialize and start web server
   */
  start(){
    "use strict";
    
    // Notify listeners that we are starting
    this.eventService.emit(WEBSERVICE_STARTING_EVENT, this);

    // TODO: Setup Express with some minimal management Rest API
    //       - for loading and unloading Apps
    //       - for enabling and disabling Apps
    //       - for enabling and disabling Modules

    this.running = true;
    // Notify listeners that we have started
    this.eventService.emit(WEBSERVICE_STARTED_EVENT, this);
  }

  /**
   * @description gracefully shutdown web server
   */
  shutdown(){
    "use strict";
    // Notify listeners that we are starting
    this.eventService.emit(WEBSERVICE_SHUTTING_DOWN_EVENT);
    this.running = false;
    // Notify listeners that we have started
    this.eventService.emit(WEBSERVICE_SHUTDOWN_EVENT);
  }

  /**
   * @description Is the webserver currently serving requests
   */
  isRunning(){
    "use strict";
    return this.running;
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
