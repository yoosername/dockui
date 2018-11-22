class ShapeValidationError extends Error{}
class MissingStoreDuringSetupError extends Error{}
class MissingEventServiceDuringSetupError extends Error{}
class MissingPluginServiceDuringSetupError extends Error{}
class MissingWebServiceDuringSetupError extends Error{}
class PluginServiceValidationError extends Error{}
class LifecycleEventsStrategyValidationError extends Error{}

module.exports = {
    ShapeValidationError,
    MissingStoreDuringSetupError,
    MissingEventServiceDuringSetupError,
    MissingPluginServiceDuringSetupError,
    MissingWebServiceDuringSetupError,
    PluginServiceValidationError,
    LifecycleEventsStrategyValidationError
};