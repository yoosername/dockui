/**
 * @description Middleware function to handle App specific Routing
 */
module.exports = function({ config, logger } = {}) {
  return async function routeHandler(ctx, next) {
    logger.debug("Routing GOES HERE");
    await next();
  };
};
