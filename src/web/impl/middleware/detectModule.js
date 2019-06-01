/**
 * @description Middleware function to Detect which App/Module(s) are being requested
 *              and add them to the CTX for later middleware to use.
 */
module.exports = function({ config, logger } = {}) {
  return async function detectModule(ctx, next) {
    logger.debug("Detected Request for App () and Module ()");
    await next();
  };
};
