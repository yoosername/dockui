/**
 * @description Middleware function to detect Api Modules and serve them
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function serveIfApi(ctx, next) {
    logger.debug("Checking if this is a request for an Api Module");

    // Otherwise just carry on
    await next();
  };
};
