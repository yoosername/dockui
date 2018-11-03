const MISSING_CLIENT_ERROR = "Missing: Expected DockerClient constructor argument";
const MISSING_EMITTER_ERROR = "Missing: Expected EventEmitter constructor argument";
const LISTING_RUNNING_CONTAINERS_ERROR = "There was a problem while trying to list the currently running containers";
const DOCKER_NOT_RUNNING_ERROR = "Docker is not detected or is currently not running";

const PLUGIN_SERVICE_NOT_RUNNING_ERROR = "Plugin service is not currently running";

module.exports.MISSING_CLIENT_ERROR = MISSING_CLIENT_ERROR;
module.exports.MISSING_EMITTER_ERROR = MISSING_EMITTER_ERROR;
module.exports.DOCKER_NOT_RUNNING_ERROR = DOCKER_NOT_RUNNING_ERROR;
module.exports.LISTING_RUNNING_CONTAINERS_ERROR = LISTING_RUNNING_CONTAINERS_ERROR;
module.exports.PLUGIN_SERVICE_NOT_RUNNING_ERROR = PLUGIN_SERVICE_NOT_RUNNING_ERROR;