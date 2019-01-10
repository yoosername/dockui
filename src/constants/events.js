/**
 * @description App service events
 */
const APPSERVICE_STARTING_EVENT = "service:starting";
const APPSERVICE_STARTED_EVENT = "service:started";
const APPSERVICE_SHUTTING_DOWN_EVENT = "service:shuttingdown";
const APPSERVICE_SHUTDOWN_EVENT = "service:shutdown";

/**
 * @description App lifecycle events
 */
const APP_LOAD_REQUESTED_EVENT = "app:load:requested";
const APP_LOAD_STARTED_EVENT = "app:load:started";
const APP_LOAD_COMPLETE_EVENT = "app:load:complete";
const APP_LOAD_FAILED_EVENT = "app:load:failed"; 
const APP_UNLOAD_STARTED_EVENT = "app:unload:started";
const APP_UNLOAD_COMPLETE_EVENT = "app:unload:complete";
const APP_UNLOAD_FAILED_EVENT = "app:unload:failed"; 
const APP_ENABLED_EVENT = "app:enabled";
const APP_DISABLED_EVENT = "app:disabled";

/**
 * @description Module lifecycle events
 */
const MODULE_LOAD_STARTED_EVENT = "module:load:started";
const MODULE_LOAD_COMPLETE_EVENT = "module:load:complete";
const MODULE_LOAD_FAILED_EVENT = "module:load:failed"; 
const MODULE_ENABLED_EVENT = "module:enabled";
const MODULE_DISABLED_EVENT = "module:disabled";

/**
 * @description Web service events
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
    APP_LOAD_REQUESTED_EVENT,
    APP_LOAD_STARTED_EVENT,
    APP_LOAD_COMPLETE_EVENT,
    APP_LOAD_FAILED_EVENT,
    APP_UNLOAD_STARTED_EVENT,
    APP_UNLOAD_COMPLETE_EVENT,
    APP_UNLOAD_FAILED_EVENT,
    APP_ENABLED_EVENT,
    APP_DISABLED_EVENT,
    MODULE_LOAD_STARTED_EVENT,
    MODULE_LOAD_COMPLETE_EVENT,
    MODULE_LOAD_FAILED_EVENT,
    MODULE_ENABLED_EVENT,
    MODULE_DISABLED_EVENT,
    WEBSERVICE_STARTING_EVENT,
    WEBSERVICE_STARTED_EVENT,
    WEBSERVICE_SHUTTING_DOWN_EVENT,
    WEBSERVICE_SHUTDOWN_EVENT
};