/**
 * @description Middleware function to strip out Page resources to the context
 *              and add resources provided by other Modules to the context too
 */
module.exports = function({ config, logger } = {}) {
  return async function addResourcesToContext(ctx, next) {
    logger.debug(
      "Strip Page Resources out of the HTML and add them to CTX for later"
    );
    await next();
  };
};
