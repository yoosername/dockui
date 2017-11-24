const MISSING_CLIENT_ERROR = "DockerService expects an instance of DockerClient as the first argument";
const MISSING_EMITTER_ERROR = "DockerService expects an instance of EventEmitter as the second argument";
const LISTING_RUNNING_CONTAINERS_ERROR = "There was a problem while trying to list the currently running containers";
const DOCKER_NOT_RUNNING_ERROR = "Docker is not detected or is currently not running";

module.exports.MISSING_CLIENT_ERROR = MISSING_CLIENT_ERROR;
module.exports.MISSING_EMITTER_ERROR = MISSING_EMITTER_ERROR;
module.exports.DOCKER_NOT_RUNNING_ERROR = DOCKER_NOT_RUNNING_ERROR;
module.exports.LISTING_RUNNING_CONTAINERS_ERROR = LISTING_RUNNING_CONTAINERS_ERROR;