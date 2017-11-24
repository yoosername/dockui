const {DOCKER_NOT_RUNNING_ERROR} = require("../constants/errors");
const DockerClient = require("./DockerClient");
const SINGLE_CONTAINER_EXAMPLE = {
  "Id": "81cde361ec7b069cc1ee32a4660176306a2b1d3a3eb52f96f17380f10e75d2e2",
  "Image": "m4all-next:15-0511-1104",
  "Names": ["/m4all-next"],
  "Command": "/bin/sh -c '/bin/bash -c 'cd /home; mkdir data; node main/app.js''",
  "Created": 1431402173,
  "HostConfig": { NetworkMode: 'default' },
  "Labels": { my_label: 'label_value' },
  "Ports": [
    {
      "IP": "172.17.42.1",
      "PrivatePort": 3000,
      "PublicPort": 3002,
      "Type": "tcp"
    }
  ],
  "Status": "Up About an hour"
};

/**
 * dockui mock native Docker client abstraction
 * @description provides mock abstraction to Docker subsystem
 * @private
 * @constructor
 */
function MockDockerClient() {
    "use strict";
  
    if (!(this instanceof MockDockerClient)) {
      return new MockDockerClient();
    }

    DockerClient.call(this);

    this._isDockerRunning = true;
    this.container = SINGLE_CONTAINER_EXAMPLE;
    
}

MockDockerClient.prototype = Object.create(DockerClient.prototype, {constructor: {value: MockDockerClient}});

/**
 * MockDockerClient.isDockerRunning
 * @description returns true if detects Docker
 * @private
 */
MockDockerClient.prototype.isDockerRunning = function(){
  "use strict";

  return this._isDockerRunning;
};

/**
 * MockDockerClient.setIsDockerRunning
 * @description switch Docker on and off
 * @private
 */
MockDockerClient.prototype.setIsDockerRunning = function(bool){
  "use strict";

  this._isDockerRunning = bool;
};

/**
 * MockDockerClient.listRunningContainers
 * @description mock detecting the current list of running Docker containers
 * @private
 */
MockDockerClient.prototype.listRunningContainers = function(callback){
  "use strict";

  if(!this.isDockerRunning()){
    throw new Error(DOCKER_NOT_RUNNING_ERROR);
  }

  return callback(null, [SINGLE_CONTAINER_EXAMPLE]);

};

module.exports = MockDockerClient;