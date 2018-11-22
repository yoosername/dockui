/**
 * @description Plugin service events
 */
const PLUGIN_SERVICE_STARTING_EVENT = "plugin:service:starting";
const PLUGIN_SERVICE_STARTED_EVENT = "plugin:service:started";
const PLUGIN_SERVICE_SHUTTING_DOWN_EVENT = "plugin:service:shuttingdown";
const PLUGIN_SERVICE_SHUTDOWN_EVENT = "plugin:service:shutdown";

/**
 * @description Plugin lifecycle events
 */
const PLUGIN_LOAD_STARTED_EVENT = "plugin:load:started";
const PLUGIN_LOAD_COMPLETE_EVENT = "plugin:load:complete";
const PLUGIN_LOAD_FAILED_EVENT = "plugin:load:failed"; 
const PLUGIN_ENABLED_EVENT = "plugin:enabled";
const PLUGIN_DISABLED_EVENT = "plugin:disabled";

/**
 * @description Plugin Module lifecycle events
 */
const PLUGIN_MODULE_ENABLED_EVENT = "module:enabled";
const PLUGIN_MODULE_DISABLED_EVENT = "module:disabled";

/**
 * @description Web service events
 */
const WEB_SERVICE_STARTING_EVENT = "web:service:starting";
const WEB_SERVICE_STARTED_EVENT = "web:service:started";
const WEB_SERVICE_SHUTTING_DOWN_EVENT = "web:service:shuttingdown";
const WEB_SERVICE_SHUTDOWN_EVENT = "web:service:shutdown";


module.exports = {
    PLUGIN_SERVICE_STARTING_EVENT,
    PLUGIN_SERVICE_STARTED_EVENT,
    PLUGIN_SERVICE_SHUTTING_DOWN_EVENT,
    PLUGIN_SERVICE_SHUTDOWN_EVENT,
    PLUGIN_LOAD_STARTED_EVENT,
    PLUGIN_LOAD_COMPLETE_EVENT,
    PLUGIN_LOAD_FAILED_EVENT,
    PLUGIN_ENABLED_EVENT,
    PLUGIN_DISABLED_EVENT,
    PLUGIN_MODULE_ENABLED_EVENT,
    PLUGIN_MODULE_DISABLED_EVENT,
    WEB_SERVICE_STARTING_EVENT,
    WEB_SERVICE_STARTED_EVENT,
    WEB_SERVICE_SHUTTING_DOWN_EVENT,
    WEB_SERVICE_SHUTDOWN_EVENT
};