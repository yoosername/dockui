/**
 * @description Middleware function to add resources in the Context back to
 *              The HTML of the Page
 */
module.exports = function({ config, logger } = {}) {
  return async function addResourcesFromContext(ctx, next) {
    logger.debug("Add Resources back in to the HTML");
    await next();
  };
};
