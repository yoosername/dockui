const parseTargetUrnFromContext = ctx => {
  // Use the info from the APP or Module
};

const parsePolicyFromContext = ctx => {
  // Use the info from the APP or Module content
  // If no Policy then add a default one
};

/**
 * @description Middleware function to add information about Principle, Target, Policy where
 *              Principle = a URN of e.g. a user,app,module,dockui instance
 *              Target = The specific App Module being requested
 *              Policy = a Policy granting Allow or Deny between Principles and Targets
 */
module.exports = function({ config, logger } = {}) {
  return async function idamDecorator(ctx, next) {
    logger.debug("Adding IDAM info for PDP into ctx");
    ctx.dockui.idam = {
      principle: null,
      target: parseTargetUrnFromContext(ctx),
      policy: parsePolicyFromContext(ctx)
    };
    // App:  urn:dockui::app:<id>
    // Module:  urn:dockui::module:<id>
    // User: urn:dockui::idam:users/<id>||<name>
    // Role: urn:dockui::idam:roles/<id>||<name>
    await next();
  };
};
