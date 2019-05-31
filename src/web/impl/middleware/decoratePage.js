/**
 * @description Middleware function to Check if a Page requires decoration and if so
 *              fetching it and decorating it
 */
module.exports = function({ config, logger } = {}) {
  return async function idamDecorator(ctx, next) {
    logger.debug("If Page requires Decoration do it here");
    await next();
  };
};
