/**
 * @description Middleware function to detect WebPage Modules and serve them
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function serveIfWebPage(ctx, next) {
    logger.debug("Checking if this is a request for a WebPage Module");

    // Otherwise just carry on
    await next();
  };
};
