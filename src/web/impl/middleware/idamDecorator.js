/**
 * @description Middleware function to add information about Principle, Target, Policy where
 *              Principle = a URN of e.g. a user,app,module,dockui instance
 *              Target = The specific App Module being requested
 *              Policy = a Policy granting Allow or Deny between Principles and Targets
 */
module.exports = function({ config, logger } = {}) {
  return async function idamDecorator(ctx, next) {
    logger.debug("IDAM INfo is added to CTX here");
    await next();
  };
};
