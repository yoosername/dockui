const {DOCKER_NOT_RUNNING_ERROR} = require("../constants/errors");
const DockerClient = require("./DockerClient");

/**
 * ContainerGenerator
 * @description generates random container objects as an array for testing
 * @private
 */
function ContainerGenerator(count){
  "use strict";

  var containers = [];
  var NAMES = ["red", "blue", "green", "purple", "yellow","pink","black"];

  function generateId(length) {
    var ret = "";
    while (ret.length < length) {
      ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0,length);
  }

  function generateName() {
    return NAMES[Math.floor(Math.random() * NAMES.length)] + "-" + generateId(4);
  }

  function generateVer() {
    return Math.floor(Math.random() * 100);
  }
  
  for(var i = 0; i < count; i++){
    var name = generateName();
    var ver  = generateVer();

    containers.push(
      {
        "Id": generateId(64),
        "Image": `${name}:${ver}`,
        "Names": [`${name}`],
        "Command": "/bin/sh -c '/bin/bash -c 'cd /app; node app.js''",
        "Created": new Date(),
        "HostConfig": { NetworkMode: 'default' },
        "Labels": { label_key: 'label_value' },
        "Ports": [
          {
            "IP": "172.17.42.1",
            "PrivatePort": 8080,
            "PublicPort": 80,
            "Type": "tcp"
          }
        ],
        "Status": "Up About an hour"
      }
    );
  }

  return containers;

}

/**
 * dockui mock native Docker client abstraction
 * @description provides mock abstraction to Docker subsystem
 * @private
 * @constructor
 */
function MockDockerClient(num) {
    "use strict";
  
    if (!(this instanceof MockDockerClient)) {
      return new MockDockerClient(num);
    }

    DockerClient.call(this);

    num = (num) ? num : 5;

    this._isDockerRunning = true;
    this.containers = ContainerGenerator(num);
    
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

  return callback(null, this.containers);

};

module.exports = MockDockerClient;