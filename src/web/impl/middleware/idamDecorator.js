const parseTargetUrnFromContext = ({ ctx, logger }) => {
  // Use the info from the APP or Module
  let targetURN = null;
  try {
    targetURN = `urn:dockui::module:${ctx.dockui.module.getId()}`;
  } catch (e) {
    logger.error("Couldnt parse targetURN from context: %o", e);
  }
  return targetURN;
};

const parsePolicyFromContext = ({ ctx, logger }) => {
  // Use the info from the APP or Module
  const module = ctx.dockui.module;
  let targetPolicy = null;
  try {
    targetPolicy = module.getAuth();
  } catch (e) {
    logger.debug(
      "Module(%s) doesnt have auth configured - skipping",
      module.getKey()
    );
  }
  return targetPolicy;
};

/**
 * @description Middleware function to add information about Principle, Target, Policy where
 *              Principle = a URN of e.g. a user,app,module,dockui instance
 *              Target = The specific App Module being requested
 *              Policy = a Policy granting Allow or Deny between Principles and Targets
 */
module.exports = function({ config, logger } = {}) {
  return async function idamDecorator(ctx, next) {
    if (!ctx.dockui) ctx.dockui = {};
    if (!ctx.dockui.idam) ctx.dockui.idam = {};
    ctx.dockui.idam = Object.assign(ctx.dockui.idam, {
      target: parseTargetUrnFromContext({ ctx, logger }),
      policy: parsePolicyFromContext({ ctx, logger }),
      action: ctx.request.method
    });
    logger.debug("Added IDAM policy info to ctx (%s)", ctx.dockui.idam);
    // Examples:
    // Module:  urn:dockui::module:<id>
    // User: urn:dockui::idam:users/<id>||<name>
    // Role: urn:dockui::idam:roles/<id>||<name>
    await next();
  };
};
