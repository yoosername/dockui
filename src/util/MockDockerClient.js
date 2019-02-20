// const { EventEmitter } = require("events");

// const {DOCKER_NOT_RUNNING_ERROR} = require("../../constants/errors");
// const {CONTAINER_START_EVENT_ID,CONTAINER_STOP_EVENT_ID} = require("../../constants/events");
// const DockerClient = require("./DockerClient");

// const NAMES = ["red", "blue", "green", "purple", "yellow","pink","black"];

// /**
//  * SingleContainerGenerator
//  * @description generates a random container objects
//  * @private
//  */
// function SingleContainerGenerator(){
//   "use strict";

//   var name = generateName();
//   var ver  = generateVer();

//   function generateId(length) {
//     var ret = "";
//     while (ret.length < length) {
//       ret += Math.random().toString(16).substring(2);
//     }
//     return ret.substring(0,length);
//   }

//   function generateName() {
//     return NAMES[Math.floor(Math.random() * NAMES.length)] + "-" + generateId(4);
//   }

//   function generateVer() {
//     return Math.floor(Math.random() * 100);
//   }

//   return {
//     "Id": generateId(64),
//     "Image": `${name}:${ver}`,
//     "Names": [`${name}`],
//     "Command": "/bin/sh -c '/bin/bash -c 'cd /app; node app.js''",
//     "Created": new Date(),
//     "HostConfig": { NetworkMode: 'default' },
//     "Labels": { label_key: 'label_value' },
//     "Ports": [
//       {
//         "IP": "172.17.42.1",
//         "PrivatePort": 8080,
//         "PublicPort": 80,
//         "Type": "tcp"
//       }
//     ],
//     "Status": "Up About an hour"
//   };

// }

// /**
//  * ContainerGenerator
//  * @description returns array of random container objects
//  * @param count how many containers to return
//  * @private
//  */
// function ContainerGenerator(count){
//   "use strict";

//   var containers = [];

//   for(var i = 0; i < count; i++){
//     containers.push(SingleContainerGenerator());
//   }

//   return containers;

// }

// /**
//  * dockui mock native Docker client abstraction
//  * @description provides mock abstraction to Docker subsystem
//  * @private
//  * @constructor
//  */
// function MockDockerClient(num) {
//     "use strict";

//     if (!(this instanceof MockDockerClient)) {
//       return new MockDockerClient(num);
//     }

//     DockerClient.call(this);

//     num = (num) ? num : 5;

//     this._isDockerRunning = true;
//     this._events = new EventEmitter();
//     this.containers = ContainerGenerator(num);

// }

// MockDockerClient.prototype = Object.create(DockerClient.prototype, {constructor: {value: MockDockerClient}});

// /**
//  * MockDockerClient.isDockerRunning
//  * @description returns true if detects Docker
//  * @private
//  */
// MockDockerClient.prototype.isDockerRunning = function(){
//   "use strict";

//   return this._isDockerRunning;
// };

// /**
//  * MockDockerClient.setIsDockerRunning
//  * @description switch Docker on and off
//  * @param bool Boolean flag
//  * @private
//  */
// MockDockerClient.prototype.setIsDockerRunning = function(bool){
//   "use strict";

//   this._isDockerRunning = bool;
// };

// /**
//  * MockDockerClient.generateNewContainer
//  * @description generate a new container object for later use
//  * @private
//  */
// MockDockerClient.prototype.generateNewContainer = function(){
//   "use strict";

//   return SingleContainerGenerator();
// };

// /**
//  * MockDockerClient.startContainer
//  * @description mock detection of a single container start on the host
//  * @param container the Docker container to add
//  * @private
//  */
// MockDockerClient.prototype.startContainer = function(container){
//   "use strict";

//   if(!this.isDockerRunning()){
//     throw new Error(DOCKER_NOT_RUNNING_ERROR);
//   }

//   container = (container) ? container : SingleContainerGenerator();
//   this.containers.push(container);
//   this._events.emit(CONTAINER_START_EVENT_ID, container);
//   return container;
// };

// /**
//  * MockDockerClient.stopContainer
//  * @description mock detection of a single container stopped on the host
//  * @param container the Docker container to stop
//  * @private
//  */
// MockDockerClient.prototype.stopContainer = function(container){
//   "use strict";

//   if(!this.isDockerRunning()){
//     throw new Error(DOCKER_NOT_RUNNING_ERROR);
//   }

//   container = (container) ? container : SingleContainerGenerator();
//   this.containers = this.containers.filter((c) => {
//     return ( c.Id !== container.Id );
//   });
//   this._events.emit(CONTAINER_STOP_EVENT_ID, container);
//   return container;
// };

// /**
//  * MockDockerClient.getEvents
//  * @description return eventemitter emitting mock events from docker events subsystem
//  * @param callback this Function will be called with the arguments (Error, EventEmitter)
//  * @private
//  */
// MockDockerClient.prototype.getEvents = function(callback){
//   "use strict";

//   callback(null, this._events);
// };

// /**
//  * MockDockerClient.listRunningContainers
//  * @description mock detecting the current list of running Docker containers
//  * @param callback this Function will be called with the arguments (Error, Array<Container>)
//  * @private
//  */
// MockDockerClient.prototype.listRunningContainers = function(callback){
//   "use strict";

//   if(!this.isDockerRunning()){
//     throw new Error(DOCKER_NOT_RUNNING_ERROR);
//   }

//   return callback(null, this.containers);
// };

// module.exports = MockDockerClient;
