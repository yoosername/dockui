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

}

module.exports = WebService;
