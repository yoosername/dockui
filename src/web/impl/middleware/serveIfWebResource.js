/**
 * @description Middleware function to detect WebResource Modules and serve them
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function serveIfWebResource(ctx, next) {
    logger.debug("Checking if this is a request for a webResource Module");

    // Otherwise just carry on
    await next();
  };
};
