/**
 * @description Middleware function to cache requests
 */
module.exports = function({ config, logger } = {}) {
  return async function cache(ctx, next) {
    logger.debug("CACHED Version would be served here");
    await next();
    logger.debug("CACHE would be updated with served version here");
  };
};
