const request = require("request");
const Module = require("../../../app/module/Module");
const WebPageModule = require("../../../app/module/impl/WebPageModule");
const path = require("path");

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

const getModuleFromModuleKey = async ({ moduleKey, appService, logger }) => {
  let module = null;
  try {
    if (moduleKey) {
      module = await appService.getModules(m => {
        return m.getKey() === moduleKey;
      });
      module = module[0];
    }
  } catch (err) {
    logger.error("Couldnt get Module from ModuleKey(key=%s)", moduleKey);
  }
  return module;
};

// Recursively fetch a page, check for decorator and if found, fetch decorator - until done
const chainFetch = async ({ ctx, moduleKey, appService, logger }) => {
  return new Promise(async (resolve, reject) => {
    let pages = [];
    const req = ctx && ctx.req ? ctx.req : null;
    let pageUrl = null;
    let decoratorModuleKey = null;

    try {
      const module = await getModuleFromModuleKey({
        moduleKey,
        appService,
        logger
      });
      if (module) {
        decoratorModuleKey = module.getDecorator();
      }

      if (moduleKey) {
        pageUrl = await getAbsolutePageUrlFromModuleKey({
          moduleKey,
          appService,
          logger
        });
      }

      const options = {
        method: "GET",
        uri: pageUrl.toString()
      };
      logger.debug(
        "Attempting to fetch page: [%s] %s",
        options.method,
        options.uri
      );

      let { res, page } = await singlePageFetcher(req, options);

      if (res.statusCode === 404) {
        logger.warn("Page was not found (%s) - SKIPPING", options.uri);
      }
      if (res.statusCode === 200) {
        pages.unshift(res.body);
        if (decoratorModuleKey) {
          pages = [].concat.apply(
            pages,
            await chainFetch({
              moduleKey: decoratorModuleKey,
              appService,
              logger
            })
          );
        }
      }
    } catch (err) {
      reject(err);
    }

    resolve(pages);
  });
};

const getAbsolutePageUrlFromModuleKey = async ({
  moduleKey,
  appService,
  logger
}) => {
  let module = null;
  let moduleUrl = null;
  let normalizedPath = null;
  let pageUrl = null;

  try {
    if (moduleKey) {
      module = await getModuleFromModuleKey({ moduleKey, appService, logger });
    }
    if (module) {
      const app = await appService.getApp(module.getAppId());
      const appBaseUrl = app.getBaseUrl();
      const appBasePath = new URL(appBaseUrl).pathname;

      moduleUrl = module.getUrl();
      normalizedPath = path.normalize(appBasePath + "/" + moduleUrl);
      pageUrl = new URL(normalizedPath, appBaseUrl);
    }
  } catch (err) {
    logger.error(
      "Error parsing  Absolute Page URL for module(key=%s) error = %o",
      moduleKey,
      err
    );
  }

  return pageUrl;
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

      // If its a WebPage
      if (module.getType() === WebPageModule.DESCRIPTOR_TYPE) {
        try {
          // Get the key
          const moduleKey = module.getKey();

          // Perform recursive Fetch against the Page and any specified decorators
          try {
            let pages = [].concat.apply(
              [],
              await chainFetch({
                ctx,
                moduleKey,
                appService,
                logger
              })
            );

            logger.silly("Stack = %o", pages);

            ctx.dockui.webPage = {
              stack: pages
            };
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
