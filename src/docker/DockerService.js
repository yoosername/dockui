const EventEmitter = require("events");
const DockerClient = require("./clients/DockerClient");
const {DOCKER_NOT_RUNNING_ERROR} = require("../constants/errors");

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

    if(!client || !(DockerClient.prototype.isPrototypeOf(client))){
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
    this._running = false;
    this._initialised = false;
    this._cache = [];
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

DockerService.prototype.handleEvent = function(type, container){
  "use strict";

  if(this._running){
    this._cache.push(container);
    this._events.emit(type, container);
  }
  
};

/**
 * DockerService.start
 * @description starts listening for container events
 * @public
 */
DockerService.prototype.start = function(){
  "use strict"; 

  // If we are not already running then fetch list of running containers
  // compare with the list we know about and send events for the difference
  if(!this._running){

    if(!this.isDockerRunning()){
      throw new Error(DOCKER_NOT_RUNNING_ERROR);
    }

    this._client.listRunningContainers((err, containers) => {

      if(err){
        return console.warn(LISTING_RUNNING_CONTAINERS_ERROR);
      }

      this._running = true;

      containers.forEach((container) => {

        if( ! this._cache.includes(container) ){
          this.handleEvent(CONTAINER_START_EVENT_ID, container);
        }
        
      });

    });

  }

  // Add event handler once on init
  if( !this._initialised ){

    // Start listening for events from the client
    this._client.getEvents((err, events) =>{

      if(err){
        return console.warn("Error getting Docker client events");
      }

      events
        .on(CONTAINER_START_EVENT_ID, (container) => {
          this.handleEvent(CONTAINER_START_EVENT_ID, container);
        })
        .on(CONTAINER_STOP_EVENT_ID, (container) => {
          this.handleEvent(CONTAINER_STOP_EVENT_ID, container);
        });
      
    });

    this._initialised = true;

  }

};

/**
 * DockerService.start
 * @description stops listening for and emitting container events
 * @public
 */
DockerService.prototype.stop = function(){
  "use strict"; 

  this._running = false;
};

module.exports = DockerService;