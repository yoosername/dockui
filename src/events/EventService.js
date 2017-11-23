const EventEmitter = require('events');
const util = require("util");

/**
 * Generic dockui global events service
 * @description provides an event backbone for the rest of the components of the app to communicate across
 * @public
 * @constructor
 */
function EventsService() {
    "use strict";
  
    if (!(this instanceof EventsService)) {
      return new EventsService();
    }
    
  }

util.inherits(EventsService, EventEmitter);

module.exports = EventsService;