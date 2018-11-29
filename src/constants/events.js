/**
 * @description App service events
 */
const APP_SERVICE_STARTING_EVENT = "app:service:starting";
const APP_SERVICE_STARTED_EVENT = "app:service:started";
const APP_SERVICE_SHUTTING_DOWN_EVENT = "app:service:shuttingdown";
const APP_SERVICE_SHUTDOWN_EVENT = "app:service:shutdown";

/**
 * @description App lifecycle events
 */
const APP_LOAD_STARTED_EVENT = "app:load:started";
const APP_LOAD_COMPLETE_EVENT = "app:load:complete";
const APP_LOAD_FAILED_EVENT = "app:load:failed"; 
const APP_ENABLED_EVENT = "app:enabled";
const APP_DISABLED_EVENT = "app:disabled";

/**
 * @description App Module lifecycle events
 */
const APP_MODULE_ENABLED_EVENT = "module:enabled";
const APP_MODULE_DISABLED_EVENT = "module:disabled";

/**
 * @description Web service events
 */
const WEB_SERVICE_STARTING_EVENT = "web:service:starting";
const WEB_SERVICE_STARTED_EVENT = "web:service:started";
const WEB_SERVICE_SHUTTING_DOWN_EVENT = "web:service:shuttingdown";
const WEB_SERVICE_SHUTDOWN_EVENT = "web:service:shutdown";


module.exports = {
    APP_SERVICE_STARTING_EVENT,
    APP_SERVICE_STARTED_EVENT,
    APP_SERVICE_SHUTTING_DOWN_EVENT,
    APP_SERVICE_SHUTDOWN_EVENT,
    APP_LOAD_STARTED_EVENT,
    APP_LOAD_COMPLETE_EVENT,
    APP_LOAD_FAILED_EVENT,
    APP_ENABLED_EVENT,
    APP_DISABLED_EVENT,
    APP_MODULE_ENABLED_EVENT,
    APP_MODULE_DISABLED_EVENT,
    WEB_SERVICE_STARTING_EVENT,
    WEB_SERVICE_STARTED_EVENT,
    WEB_SERVICE_SHUTTING_DOWN_EVENT,
    WEB_SERVICE_SHUTDOWN_EVENT
};