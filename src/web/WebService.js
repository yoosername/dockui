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
  * @argument {AppService} appService The AppService for interacting with Apps 
  * @argument {EventService} eventService The EventService to use for web events
  */
  constructor(appService, eventService){
    this.running = false;

    validateShapes([
      {"shape":"AppService","object":appService},
      {"shape":"EventService","object":eventService}
    ]);

    this.appService = appService;
    this.eventService = eventService;
  }

  /**
   * @description initialize and start web server
   */
  start(){
    "use strict";
    
    // Notify listeners that we are starting
    this.eventService.emit(WEBSERVICE_STARTING_EVENT, this);

    // TODO: Setup Express with defaults
    // TODO: Add a route for Management Rest API ( Takes precendence over Apps provided route of same name )
    //       List All Apps - GET /rest/admin/apps
    //       Attempt to Load App - POST /rest/admin/apps {url: "https:/location.of/descriptor.yml", permission: "READ"} - returns new App URI
    //       Get single App - GET /rest/admin/apps/{appKey}||{appUUID}
    //       Reload App (or change Permission) - PUT /rest/admin/apps/{appKey}||{appUUID} {url: "https:/location.of/descriptor.yml", permission: "READ"}
    //       Unload App - DELETE /rest/admin/apps/{appKey}||{appUUID}
    //       List Apps Modules - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules
    //       Enable App - GET/POST /rest/admin/apps/{appKey}||{appUUID}/enable
    //       Disable App - GET/POST /rest/admin/apps/{appKey}||{appUUID}/disable
    //       Enable Module - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules/{moduleKey}/enable
    //       Disable Module - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules/{moduleKey}/disable

    this.running = true;
    // Notify listeners that we have started
    this.eventService.emit(WEBSERVICE_STARTED_EVENT, this);
  }

  /**
   * @description Gracefully shutdown web server
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
   * @returns {Boolean} Returns true if the WebService is currently running
   */
  isRunning(){
    "use strict";
    return this.running;
  }

  /**
   * @description Helper to get the passed in AppService
   * @returns {AppService} the AppService
   */
  getAppService(){
    "use strict";
    return this.appService;
  }

  /**
   * @description Helper to get the passed in EventService
   * @returns {EventService} the EventService
   */
  getEventService(){
    "use strict";
    return this.eventService;
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
