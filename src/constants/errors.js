class MissingStoreDuringSetupError extends Error{}
class MissingEventServiceDuringSetupError extends Error{}
class MissingPluginServiceDuringSetupError extends Error{}
class MissingWebServiceDuringSetupError extends Error{}
class PluginServiceValidationError extends Error{}

module.exports = {
    MissingStoreDuringSetupError,
    MissingEventServiceDuringSetupError,
    MissingPluginServiceDuringSetupError,
    MissingWebServiceDuringSetupError,
    PluginServiceValidationError
};