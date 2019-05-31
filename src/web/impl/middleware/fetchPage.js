/**
 * @description Middleware function to Go get the page from the Serving App
 */
module.exports = function({ config, logger } = {}) {
  return async function fetchPage(ctx, next) {
    logger.debug("Page fetched from App remote URL here");
    await next();
  };
};
