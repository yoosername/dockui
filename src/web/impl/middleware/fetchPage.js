const request = require("request");
const Module = require("../../../app/module/Module");
const WebPageModule = require("../../../app/module/impl/WebPageModule");
const path = require("path");

const fetcher = async (req, options) => {
  return new Promise(function(resolve, reject) {
    try {
      req.pipe(
        request(options, (err, res, body) => {
          if (err) return reject(err);
          resolve({ res, body });
        })
      );
    } catch (err) {
      reject(err);
    }
  }); //.then(function(response) {
  //     response.pipe(process.stdout);
  // });
};
/**
 * @description Middleware function to detect Api Modules and serve them
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function fetchPage(ctx, next) {
    logger.debug("Checking if this is a request for a Page Module");

    // If this is a request for a WebPage module then fetch the page and add to context
    // as we may need to do more work on it upstream

    // If There is a module on the context
    if (
      ctx.dockui &&
      ctx.dockui.module &&
      ctx.dockui.module instanceof Module
    ) {
      const module = ctx.dockui.module;
      const app = ctx.dockui.app;

      // If its a WebPage
      if (module.getType() === WebPageModule.DESCRIPTOR_TYPE) {
        try {
          const appBaseUrl = app.getBaseUrl();
          const appBasePath = new URL(appBaseUrl).pathname;
          const moduleUrl = module.getUrl();
          const normalizedPath = path.normalize(appBasePath + "/" + moduleUrl);
          const pageUrl = new URL(normalizedPath, appBaseUrl);
          logger.debug(
            "This is a WebPageModule, fetching from %s and adding to the context for later",
            pageUrl
          );
          try {
            const { res, body } = await fetcher(ctx.req, {
              method: "GET",
              uri: pageUrl.toString()
            });
            //If doesnt exist then just 404 it now
            if (res.statusCode === 404) {
              ctx.status = 404;
              ctx.body = {
                error: {
                  status: 404,
                  message: "WebPage (key=" + module.getKey() + ") not found"
                }
              };
              return;
            }
            if (res.statusCode === 200) {
              logger.debug("WebPage fetched OK - added to context for later");
              ctx.dockui.webPage = {
                html: body
              };
            }
          } catch (err) {
            // If here there was an unknown error
            return ctx.throw(err);
          }
        } catch (e) {
          logger.error("Error streaming WebResource, error = %o", e);
        }
      }
    }

    // Otherwise just carry on
    await next();
  };
};
