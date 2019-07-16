const Module = require("../../../app/module/Module");
const ApiModule = require("../../../app/module/impl/ApiModule");
const path = require("path");

const { fetch } = require("../../../util");

/**
 * @description Middleware function to detect Api Modules and serve them
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function serveIfApi(ctx, next) {
    logger.debug("Checking if this is a request for an API Module");

    // If this is a request for an Api simply build the request and stream it

    // If There is a module on the context
    if (
      ctx.dockui &&
      ctx.dockui.module &&
      ctx.dockui.module instanceof Module
    ) {
      const module = ctx.dockui.module;
      const app = ctx.dockui.app;

      // If its an Api
      if (module.getType() === ApiModule.DESCRIPTOR_TYPE) {
        try {
          const appBaseUrl = app.getBaseUrl();
          const appBasePath = new URL(appBaseUrl).pathname;
          const moduleUrl = module.getUrl();
          const normalizedPath = path.normalize(appBasePath + "/" + moduleUrl);
          const apiUrl = new URL(normalizedPath, appBaseUrl);
          logger.debug(
            "This is an Api Module, Proxying Api directly from %s",
            apiUrl
          );
          return (ctx.body = fetch(ctx.req, {
            uri: apiUrl.toString(),
            config
          }));
        } catch (e) {
          logger.error("Error streaming WebResource, error = %o", e);
        }
      }
    }

    // Otherwise just carry on
    await next();
  };
};
