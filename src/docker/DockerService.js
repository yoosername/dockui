const EventEmitter = require("events");
const DockerClient = require("./DockerClient");
const {
  MISSING_CLIENT_ERROR, 
  MISSING_EMITTER_ERROR,
  LISTING_RUNNING_CONTAINERS_ERROR
} = require("../constants/errors");
const {
  CONTAINER_START_EVENT_ID,
  CONTAINER_STOP_EVENT_ID
} = require("../constants/events");

/**
 * @name DockerService
 * @description provides abstraction to Docker subsystem
 * @public
 * @constructor
 * @param client DockerClient instance
 * @param events EventEmitter instance
 */
function DockerService(client, events) {
    "use strict";

    if(!client || !(client instanceof DockerClient)){
      throw new Error(MISSING_CLIENT_ERROR);
    }

    if(!events || !(events instanceof EventEmitter)){
      throw new Error(MISSING_EMITTER_ERROR);
    }
  
    if (!(this instanceof DockerService)) {
      return new DockerService(client, events);
    }

    this._client = client;
    this._events = events;
    this._started = false;
}

/**
 * DockerService.isDockerRunning
 * @description returns true if client reports Docker is running
 * @public
 * @returns Boolean
 */
DockerService.prototype.isDockerRunning = function(){
  "use strict";

  return this._client.isDockerRunning();
};

/**
 * DockerService.start
 * @description starts listening for container events
 * @public
 */
DockerService.prototype.start = function(){
  "use strict"; 

  // Do once: Use the client to retrieve the current list of running containers
  // Do once: Start listening
  if(!this._started){

    this._client.listRunningContainers((err, containers) => {
      if(err){
        return console.warn(LISTING_RUNNING_CONTAINERS_ERROR);
      }

      containers.forEach((container) => {
        this._events.emit(CONTAINER_START_EVENT_ID, container);
      });
    });

    // Start listening for events from the client
    this._client.getEvents((err, events) =>{
      if(err){
        return console.warn("Error getting client events");
      }

      events
      .on(CONTAINER_START_EVENT_ID, (container) => {
        this._events.emit(CONTAINER_START_EVENT_ID, container);
      })
      .on(CONTAINER_STOP_EVENT_ID, (container) => {
        this._events.emit(CONTAINER_STOP_EVENT_ID, container);
      });
      
    });

    this._started = true;

  }

};

module.exports = DockerService;