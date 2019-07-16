const AuthorizationProviderModule = require("../../../app/module/impl/AuthorizationProviderModule");
const path = require("path");

const { fetchBody } = require("../../../util");

/**
 * @description Middleware function to Decide if request can proceed based on Info added by IDAM middleware
 *              - This will delegate to AuthorisationProvider modules and return first result of first one
 *              - which opts in to handle the request
 */
module.exports = function({ appService, logger, config } = {}) {
  return async function policyDecisionPoint(ctx, next) {
    logger.silly("PDP Check Happens HERE, idam info = %o", ctx.dockui.idam);
    // Perform a policy check if one is required
    if (
      ctx.dockui &&
      ctx.dockui.idam !== null &&
      ctx.dockui.idam.policy &&
      (ctx.dockui.idam.policy !== undefined &&
        ctx.dockui.idam.policy !== "" &&
        ctx.dockui.idam.policy !== null)
    ) {
      // Look for authorisationModule types that are enabled
      let authModules = await appService.getModules(
        module =>
          module.getType() === AuthorizationProviderModule.DESCRIPTOR_TYPE &&
          module.isEnabled() === true
      );

      // If there are authorisation modules
      if (authModules && authModules.length && authModules.length > 0) {
        // Sort by weight
        authModules = authModules.sort((a, b) => {
          return a.getWeight() - b.getWeight();
        });
        // Try them in order
        logger.debug(
          "Authorisation is required for module(%s) - Trying %d providers = %o",
          ctx.dockui.module.getKey(),
          authModules.length,
          authModules
        );

        // Build the url from app base path and authorization module path
        const authModuleAppId = authModules[0].getAppId();
        const moduleURL = authModules[0].getUrl();
        const app = await appService.getApp(authModuleAppId);
        const appBaseURL = app.getBaseUrl();
        const appBasePath = new URL(appBaseURL).pathname;
        const normalizedPath = path.normalize(appBasePath + moduleURL);
        const authURL = new URL(normalizedPath, appBaseURL);

        // POST the policy info for the PDP to make a decision
        let options = {
          method: "POST",
          uri: authURL.href,
          simple: false,
          body: ctx.dockui.idam,
          resolveWithFullResponse: true,
          json: true,
          config: config
        };
        logger.debug("Requesting PDP Check with options: %o", options);

        // Make the request
        try {
          const result = await fetchBody(options);
          logger.debug(
            "Result = %o, body = %o, REdirect URI = ",
            result.statusCode,
            result.body,
            result.body.url
          );
          if (result.statusCode === 403) {
            ctx.status = 403;
            ctx.body = result.body;
            return;
          } else if (result.statusCode === 200) {
            logger.debug("User session passes PDP Check, user: ", result.body);
          }
        } catch (err) {
          logger.warn("PDP Check failed with status other than 200,403", err);
        }
      }
    } else {
      logger.debug(
        "Authorisation is not required for module(%s)",
        ctx.dockui.module.getKey()
      );
    }
    await next();
  };
};
