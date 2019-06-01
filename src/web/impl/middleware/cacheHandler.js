/**
 * @description Middleware function to cache requests
 */
module.exports = function({ config, logger } = {}) {
  return async function cache(ctx, next) {
    logger.debug("CACHING GOES HERE");
    await next();
  };
};
