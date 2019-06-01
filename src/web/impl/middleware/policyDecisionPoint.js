/**
 * @description Middleware function to Decide if request can proceed based on Info added by IDAM middleware
 *              - This will delegate to AuthorisationProvider modules and return first result of first one
 *              - which opts in to handle the request
 */
module.exports = function({ config, logger } = {}) {
  return async function policyDecisionPoint(ctx, next) {
    logger.debug("PDP Check Happens HERE");
    await next();
  };
};
