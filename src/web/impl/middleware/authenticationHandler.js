/**
 * @description Middleware function to redirect a user to a Login service
 *              - This could also be provided e.g. as a login page and backing Api
 *              - Or it could redirect to an IDP for a SAML based flow etc
 */
module.exports = function({ config, logger } = {}) {
  return async function authenticationHandler(ctx, next) {
    logger.debug("Authentication Redirect MIGHT HAPPEN HERE");
    await next();
  };
};
