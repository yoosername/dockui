const request = require("request");
const Module = require("../../../app/module/Module");
const WebPageModule = require("../../../app/module/impl/WebPageModule");
const path = require("path");
const cheerio = require("cheerio");

const singlePageFetcher = async (req, options) => {
  return new Promise(function(resolve, reject) {
    try {
      if (req) {
        req.pipe(
          request(options, (err, res, body) => {
            if (err) return reject(err);
            resolve({ res, body });
          })
        );
      } else {
        request(options, (err, res, body) => {
          if (err) return reject(err);
          resolve({ res, body });
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

const getDecoratorKey = html => {
  // parse html and look for decorator meta tag and return or null;
  let template = null;
  let decoratorModuleKey = null;
  try {
    template = cheerio.load(html);
    decoratorModuleKey = template("meta[name=decorator]").prop("content");
  } catch (err) {}
  return decoratorModuleKey;
};

const getPageUrlFromModule = ({ module, appService }) => {
  const parentAppId = module.getAppId();
  const parentApp = appService.getApp(parentAppId);
  const appBaseUrl = parentApp.getBaseUrl();
  const appBasePath = new URL(appBaseUrl).pathname;
  const moduleUrl = module.getUrl();
  const normalizedPath = path.normalize(appBasePath + "/" + moduleUrl);
  const pageUrl = new URL(normalizedPath, appBaseUrl);
  return pageUrl;
};

const getDecoratorPageUrlFromPage = ({ page, appService }) => {
  const decoratorKey = getDecoratorKey(page);
  let decoratorUrl = null;

  if (decoratorKey) {
    const decoratorModule = appService.getModules(m => {
      return m.getKey() === decoratorKey;
    })[0];
    decoratorUrl = getPageUrlFromModule({
      module: decoratorModule,
      appService
    });
  }
  return decoratorUrl;
};

// Recursively fetch a page, check for decorator and if found, fetch decorator - until done
const chainFetch = async ({ ctx, options, pages, appService, logger }) => {
  return new Promise(async (resolve, reject) => {
    if (!pages) pages = [];
    const req = ctx && ctx.req ? ctx.req : null;

    try {
      const { res, page } = await singlePageFetcher(req, options);
      if (res.statusCode === 404) {
        logger.warn("decorator specified but was missing - skipping");
      }
      if (res.statusCode === 200) {
        pages.unshift(page);
        const decoratorPageUrl = getDecoratorPageUrlFromPage({
          page,
          appService
        });
        if (decoratorPageUrl) {
          options.uri = decoratorPageUrl;
          const decorator = await chainFetch({
            options,
            pages,
            appService,
            logger
          });
          pages.unshift(decorator);
        }
      }
    } catch (err) {}

    resolve(pages);
  });
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
            // Get te initial page
            const { res, body } = await singlePageFetcher(ctx.req, {
              method: "GET",
              uri: pageUrl.toString()
            });

            // If doesnt exist then just 404 it now
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
              logger.debug(
                "Main WebPage fetched OK - try to get decorator chain"
              );
              // Get first decorator (if any )
              const decoratorPageUrl = getDecoratorPageUrlFromPage({
                page: body,
                appService
              });
              let decorators = [];
              if (decoratorPageUrl) {
                // Fetch it and any parents all the way up the stack.
                decorators = await chainFetch({
                  ctx,
                  options: {
                    method: "GET",
                    uri: decoratorPageUrl
                  },
                  appService,
                  logger
                });
              }

              ctx.dockui.webPage = {
                html: body,
                decorators: decorators
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
