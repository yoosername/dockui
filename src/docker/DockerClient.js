const Docker = require('dockerode');
const fs = require('fs');
const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const {DOCKER_NOT_RUNNING_ERROR} = require("../constants/errors");

/**
 * dockui native Docker client abstraction
 * @description provides abstraction to Docker subsystem
 * @public
 * @constructor
 */
function DockerClient() {
    "use strict";
  
    if (!(this instanceof DockerClient)) {
      return new DockerClient();
    }

    this._client = new Docker({ socketPath: '/var/run/docker.sock' });
    
}

/**
 * DockerClient.isDockerRunning
 * @description returns true if detects Docker
 * @public
 */
DockerClient.prototype.isDockerRunning = function(){
  "use strict";

  return fs.statSync(socket);
};

DockerClient.prototype.listRunningContainers = function(){
  "use strict";

  if(!this.isDockerRunning()){
    throw new Error(DOCKER_NOT_RUNNING_ERROR);
  }

  this._client.listContainers({all: true}, function (err, containers) {

    if (err) {
        console.log('Error listing running containers: %s', err.message, err);
        return;
    }

    return containers;

  });

};

module.exports = DockerClient;