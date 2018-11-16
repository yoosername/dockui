// const Docker = require('dockerode');
// const DockerClient = require("./DockerClient");
// const fs = require('fs');
// const DOCKER_SOCKET = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
// const {DOCKER_NOT_RUNNING_ERROR} = require("../../constants/errors");

// /**
//  * DockerodeDockerClient
//  * @description provides abstraction to Docker subsystem using dockerode
//  * @extends DockerClient
//  * @public
//  * @constructor
//  */
// function DockerodeDockerClient() {
//     "use strict";
  
//     if (!(this instanceof DockerodeDockerClient)) {
//       return new DockerodeDockerClient();
//     }

//     DockerClient.call(this);

//     this._client = new Docker({ socketPath: DOCKER_SOCKET });
    
// }

// DockerodeDockerClient.prototype = Object.create(DockerClient.prototype, {constructor: {value: DockerodeDockerClient}});

// /**
//  * DockerodeDockerClient.isDockerRunning
//  * @description returns true if detects Docker via the socket
//  * @public
//  */
// DockerodeDockerClient.prototype.isDockerRunning = function(){
//   "use strict";

//   return fs.statSync(DOCKER_SOCKET);
// };

// /**
//  * DockerodeDockerClient.listRunningContainers
//  * @description returns a list of the current running Docker containers
//  * @public
//  * @param callback list of container objects will be passed to the callback if successfull
//  */
// DockerodeDockerClient.prototype.listRunningContainers = function(callback){
//   "use strict";

//   if(!this.isDockerRunning()){
//     throw new Error(DOCKER_NOT_RUNNING_ERROR);
//   }

//   this._client.listContainers({all: true}, function (err, containers) {

//     if (err) {
//         console.log('Error listing running containers: %s', err.message, err);
//         return;
//     }

//     if(typeof(callback) === "function"){
//       callback(containers);
//     } 

//   });

// };

// module.exports = DockerodeDockerClient;