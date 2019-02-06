/**
 * @description App service events
 * @ignore
 */
const APPSERVICE_STARTING_EVENT = "appservice:starting";
const APPSERVICE_STARTED_EVENT = "appservice:started";
const APPSERVICE_SHUTTING_DOWN_EVENT = "appservice:shuttingdown";
const APPSERVICE_SHUTDOWN_EVENT = "appservice:shutdown";

/**
 * @description App lifecycle events
 * @ignore
 */
// const APP_LOAD_REQUESTED_EVENT = "app:load:requested";
// const APP_LOAD_STARTED_EVENT = "app:load:started";
// const APP_LOAD_COMPLETE_EVENT = "app:load:complete";
// const APP_LOAD_FAILED_EVENT = "app:load:failed"; 
// const APP_UNLOAD_STARTED_EVENT = "app:unload:started";
// const APP_UNLOAD_COMPLETE_EVENT = "app:unload:complete";
// const APP_UNLOAD_FAILED_EVENT = "app:unload:failed"; 
// const APP_ENABLED_EVENT = "app:enabled";
// const APP_DISABLED_EVENT = "app:disabled";

/**
 * @description App loaders lifecycle events
 * @ignore
 */
const DOCKER_APP_LOAD_REQUEST = "dockerapploader:app:load:request";
const DOCKER_APP_LOAD_STARTED = "dockerapploader:app:load:started";
const DOCKER_APP_LOAD_COMPLETE = "dockerapploader:app:load:complete";
const DOCKER_APP_LOAD_FAILED = "dockerapploader:app:load:failed";
const DOCKER_CONTAINER_DETECTED = "dockerapploader:container:detected";
const GIT_APP_LOAD_REQUEST = "gitapploader:app:load:request";
const GIT_APP_LOAD_STARTED = "gitapploader:app:load:started";
const GIT_APP_LOAD_COMPLETE = "gitapploader:app:load:complete";
const GIT_APP_LOAD_FAILED = "gitapploader:app:load:failed";
const FILE_APP_LOAD_REQUEST = "fileapploader:app:load:request";
const FILE_APP_LOAD_STARTED = "fileapploader:app:load:started";
const FILE_APP_LOAD_COMPLETE = "fileapploader:app:load:complete";
const FILE_APP_LOAD_FAILED = "fileapploader:app:load:failed";
const URL_APP_LOAD_REQUEST = "urlapploader:app:load:request";
const URL_APP_LOAD_STARTED = "urlapploader:app:load:started";
const URL_APP_LOAD_COMPLETE = "urlapploader:app:load:complete";
const URL_APP_LOAD_FAILED = "urlapploader:app:load:failed";

/**
 * @description Module lifecycle events
 * @ignore
 */
// const MODULE_LOAD_STARTED_EVENT = "module:load:started";
// const MODULE_LOAD_COMPLETE_EVENT = "module:load:complete";
// const MODULE_LOAD_FAILED_EVENT = "module:load:failed"; 
// const MODULE_ENABLED_EVENT = "module:enabled";
// const MODULE_DISABLED_EVENT = "module:disabled";

/**
 * @description Web service events
 * @ignore
 */
const WEBSERVICE_STARTING_EVENT = "web:starting";
const WEBSERVICE_STARTED_EVENT = "web:started";
const WEBSERVICE_SHUTTING_DOWN_EVENT = "web:shuttingdown";
const WEBSERVICE_SHUTDOWN_EVENT = "web:shutdown";


module.exports = {
    APPSERVICE_STARTING_EVENT,
    APPSERVICE_STARTED_EVENT,
    APPSERVICE_SHUTTING_DOWN_EVENT,
    APPSERVICE_SHUTDOWN_EVENT,
    // APP_LOAD_REQUESTED_EVENT,
    // APP_LOAD_STARTED_EVENT,
    // APP_LOAD_COMPLETE_EVENT,
    // APP_LOAD_FAILED_EVENT,
    // APP_UNLOAD_STARTED_EVENT,
    // APP_UNLOAD_COMPLETE_EVENT,
    // APP_UNLOAD_FAILED_EVENT,
    // APP_ENABLED_EVENT,
    // APP_DISABLED_EVENT,
    // MODULE_LOAD_STARTED_EVENT,
    // MODULE_LOAD_COMPLETE_EVENT,
    // MODULE_LOAD_FAILED_EVENT,
    // MODULE_ENABLED_EVENT,
    // MODULE_DISABLED_EVENT,
    WEBSERVICE_STARTING_EVENT,
    WEBSERVICE_STARTED_EVENT,
    WEBSERVICE_SHUTTING_DOWN_EVENT,
    WEBSERVICE_SHUTDOWN_EVENT,
    DOCKER_APP_LOAD_REQUEST,
    DOCKER_APP_LOAD_STARTED,
    DOCKER_APP_LOAD_COMPLETE,
    DOCKER_APP_LOAD_FAILED,
    DOCKER_CONTAINER_DETECTED,
    GIT_APP_LOAD_REQUEST,
    GIT_APP_LOAD_STARTED,
    GIT_APP_LOAD_COMPLETE,
    GIT_APP_LOAD_FAILED,
    FILE_APP_LOAD_REQUEST,
    FILE_APP_LOAD_STARTED,
    FILE_APP_LOAD_COMPLETE,
    FILE_APP_LOAD_FAILED,
    URL_APP_LOAD_REQUEST,
    URL_APP_LOAD_STARTED,
    URL_APP_LOAD_COMPLETE,
    URL_APP_LOAD_FAILED,
};