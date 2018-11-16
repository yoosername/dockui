/**
 * @description Plugin related events
 */
const PLUGIN_SERVICE_STARTED_EVENT = "pluginService:started";
const PLUGIN_SERVICE_SHUTDOWN_EVENT = "pluginService:shutdown";
const PLUGIN_LOADED_EVENT = "plugin:loaded";
const PLUGIN_ENABLED_EVENT = "plugin:enabled";
const PLUGIN_DISABLED_EVENT = "plugin:disabled";

/**
 * @description Plugin Module related events
 */
const PLUGIN_MODULE_ENABLED_EVENT = "module:enabled";
const PLUGIN_MODULE_DISABLED_EVENT = "module:disabled";

module.exports = {
    PLUGIN_SERVICE_STARTED_EVENT,
    PLUGIN_SERVICE_SHUTDOWN_EVENT,
    PLUGIN_LOADED_EVENT,
    PLUGIN_ENABLED_EVENT,
    PLUGIN_DISABLED_EVENT,
    PLUGIN_MODULE_ENABLED_EVENT,
    PLUGIN_MODULE_DISABLED_EVENT
};