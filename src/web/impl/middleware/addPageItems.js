/**
 * @description Middleware function to add page Items into
 *              The HTML of the Page
 */
module.exports = function({ config, logger } = {}) {
  return async function addPageItems(ctx, next) {
    logger.debug("Add page items in to the HTML");
    await next();
  };
};
