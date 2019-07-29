const Module = require("../../../app/module/Module");
const ApiModule = require("../../../app/module/impl/ApiModule");
const path = require("path");
const { fetch, getRequestBody } = require("../../../util");
const request_native = require("request-promise-native");

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
          // Pass over required headers and body if there is one
          const requestBody = getRequestBody(ctx);
          let options = {
            url: apiUrl + (ctx.querystring ? "?" + ctx.querystring : ""),
            headers: ctx.request.header,
            encoding: null,
            followRedirect: false,
            method: ctx.method,
            body: requestBody,
            simple: false,
            resolveWithFullResponse: true
          };

          // Only Need to pipe the stream in if we dont already have some request body
          let response;
          if (requestBody || ctx.method === "GET") {
            response = await request_native(options);
          } else {
            response = await fetch(ctx.req, options);
          }

          // Set the response headers back on the context
          for (var header in response.headers) {
            // This causes a bug
            if (header === "transfer-encoding") {
              continue;
            }
            ctx.set(header, response.headers[header]);
          }
          ctx.body = response;
          ctx.status = response.statusCode;
          return;
        } catch (e) {
          logger.error("Error streaming WebResource, error = %o", e);
        }
      }
    }

    // Otherwise just carry on
    await next();
  };
};
