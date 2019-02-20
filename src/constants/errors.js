class ShapeValidationError extends Error {}
class MissingStoreDuringSetupError extends Error {}
class MissingEventServiceDuringSetupError extends Error {}
class MissingAppServiceDuringSetupError extends Error {}
class MissingWebServiceDuringSetupError extends Error {}
class AppServiceValidationError extends Error {}
class AppBootstrapError extends Error {}
class SecurityContextAppPostFailedError extends Error {}
class LifecycleEventsStrategyValidationError extends Error {}
class MalformedModuleDescriptorError extends Error {}
class MalformedAppDescriptorError extends Error {}
class DockerNotRunningError extends Error {}
class DockerProblemListingContainersError extends Error {}
class ConfigValidationError extends Error {}

module.exports = {
  ShapeValidationError,
  MissingStoreDuringSetupError,
  MissingEventServiceDuringSetupError,
  MissingAppServiceDuringSetupError,
  MissingWebServiceDuringSetupError,
  AppServiceValidationError,
  AppBootstrapError,
  SecurityContextAppPostFailedError,
  LifecycleEventsStrategyValidationError,
  MalformedModuleDescriptorError,
  MalformedAppDescriptorError,
  DockerNotRunningError,
  DockerProblemListingContainersError,
  ConfigValidationError
};
