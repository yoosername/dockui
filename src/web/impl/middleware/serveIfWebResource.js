const Module = require("../../../app/module/Module");
const WebResourceModule = require("../../../app/module/impl/WebResourceModule");
const path = require("path");
const { fetch } = require("../../../util");

/**
 * @description Middleware function to detect WebResource Modules and serve them
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function serveIfWebResource(ctx, next) {
    logger.debug("Checking if this is a request for a webResource Module");

    // If this is a request for a WebResource then find out the exact location and
    // pipe it directly

    // If There is a module on the context
    if (
      ctx.dockui &&
      ctx.dockui.module &&
      ctx.dockui.module instanceof Module
    ) {
      const module = ctx.dockui.module;
      const app = ctx.dockui.app;

      // If its a WebResource
      if (module.getType() === WebResourceModule.DESCRIPTOR_TYPE) {
        if (ctx.dockui.resourcePath) {
          try {
            // if ctx.dockui.resourcePath is not static then just serve it
            const appBaseUrl = app.getBaseUrl();
            const appBasePath = new URL(appBaseUrl).pathname;
            const normalizedPath = path.normalize(
              appBasePath + "/" + ctx.dockui.resourcePath
            );
            const resourceUrl = new URL(normalizedPath, appBaseUrl);
            logger.debug(
              "This is a Resource Module, streaming file directly from %s",
              resourceUrl
            );
            return (ctx.body = fetch(ctx.req, {
              uri: resourceUrl.toString(),
              config
            }));
            // if ctx.dockui.resourcePath is static then serve
          } catch (e) {
            logger.error("Error streaming WebResource, error = %o", e);
          }
        }
      }
    }

    // Otherwise just carry on
    await next();
  };
};
