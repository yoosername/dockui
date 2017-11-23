const EventEmitter = require("events");
const MISSING_EMITTER_ERROR = require("../constants").errors.MISSING_EMITTER_ERROR;

/**
 * dockui Docker service
 * @description provides abstraction to Docker subsystem
 * @public
 * @constructor
 */
function DockerService(events) {
    "use strict";

    if(!events || !(events instanceof EventEmitter)){
      throw new Error(MISSING_EMITTER_ERROR);
    }
  
    if (!(this instanceof DockerService)) {
      return new DockerService(events);
    }
    
}

module.exports = DockerService;