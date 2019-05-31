/**
 * @description Middleware function to inject page fragments into the HTML
 */
module.exports = function({ config, logger } = {}) {
  return async function addPageFragments(ctx, next) {
    logger.debug("Add Page fragments in to the HTML");
    await next();
  };
};
