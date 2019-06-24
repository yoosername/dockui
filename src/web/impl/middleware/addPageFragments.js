const WebFragmentModule = require("../../../app/module/impl/WebFragmentModule");
const request = require("request");
const path = require("path");
const cheerio = require("cheerio");

const fetch = async (req, options) => {
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

const getFragmentContextsFromPage = ({ selector, logger }) => {
  let fragmentContexts = null;
  try {
    fragmentContexts = selector("[data-webFragmentsFor]");
  } catch (err) {
    logger.error("Error parsing page for Decorator contexts, error = %o", err);
  }
  return fragmentContexts;
};

const getAbsoluteFragmentUrlFromModule = async ({
  module,
  appService,
  logger
}) => {
  let moduleUrl = null;
  let normalizedPath = null;
  let fragmentUrl = null;

  try {
    if (module) {
      const app = await appService.getApp(module.getAppId());
      const appBaseUrl = app.getBaseUrl();
      const appBasePath = new URL(appBaseUrl).pathname;

      moduleUrl = module.getUrl();
      normalizedPath = path.normalize(appBasePath + "/" + moduleUrl);
      fragmentUrl = new URL(normalizedPath, appBaseUrl);
    }
  } catch (err) {
    logger.error(
      "Error parsing Absolute Fragment URL for module(key=%s) error = %o",
      moduleKey,
      err
    );
  }

  return fragmentUrl;
};

const fetchAndInjectFragment = async ({
  dom,
  selector,
  app,
  module,
  logger,
  appService
}) => {
  logger.debug(
    "ATTEMPT TO INJECT Selector(%s), App(%s), Module(%s)",
    selector.html(),
    app.getKey(),
    module.getKey()
  );
  try {
    let fragmentHtml = "";
    console.log("GETS 1");
    const fragmentUrl = await getAbsoluteFragmentUrlFromModule({
      module,
      appService,
      logger
    });
    console.log("GETS 2");
    const { res, body } = await fetch(null, {
      uri: fragmentUrl,
      method: "GET"
    });
    console.log("GETS 3");
    if (res.statusCode === 200 && body) {
      const $fragment = cheerio.load(body);
      const fragSelector = module.getSelector();
      const actual = $fragment(fragSelector);
      if (actual) {
        console.log("GETS 4");
        fragmentHtml = actual.html();
        selector.replaceWith(dom(fragmentHtml));
      } else {
        logger.error("Error couldnt find valid fragment selector");
      }
    } else {
      logger.error("Error fetching WebFragment, status($o)", res.statusCode);
    }
  } catch (err) {
    logger.error(
      "Error fetching WebFragment, App(%s), Module(%s) : error = %o",
      app.getKey(),
      module.getKey(),
      err
    );
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(index, array[index], array);
  }
}

/**
 * @description Middleware function to inject page fragments into the HTML
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function addPageFragments(ctx, next) {
    try {
      logger.debug("Finding Page fragments to inject into page");
      // If there are any fragment injection points
      const $ = cheerio.load(ctx.dockui.webPage.decoratedPage);
      const fragmentContexts = getFragmentContextsFromPage({
        selector: $,
        logger
      });
      if (fragmentContexts !== null) {
        // Get all modules of type fragment which are enabled
        //logger.debug("Fragment contexts = (%o)", fragmentContexts.html());
        const fragmentModules = await appService.getModules(module => {
          return (
            module.getType() === WebFragmentModule.DESCRIPTOR_TYPE &&
            module.isEnabled()
          );
        });
        //logger.debug("Injecting with: %o", fragmentModules);
        // For each fragment context
        await asyncForEach(fragmentContexts, async (i, el) => {
          const selector = $(el);
          const context = $(el).data("webfragmentsfor");
          logger.debug("Testing Fragment Modules for location: %s", context);
          await asyncForEach(fragmentModules, async (index, module) => {
            let location = module.getLocation();
            const parts = location.split(":");
            // If used a : then check the app is the current app if not then its targetting any app
            if (parts.length >= 2) {
              if (
                !parts[0] === ctx.dockui.app.getKey() &&
                !parts[0] === ctx.dockui.app.getAlias()
              ) {
                // user specified an app and this isnt it so skipping
                return;
              }
              // In this case the location is actually the bit after the colon
              location = parts[1];
            }
            // Does the remaining part match the context in the HTML ( Regex test )
            const tester = RegExp(location);
            if (tester.test(context)) {
              // If gets here then location matches so we should inject the fragment
              logger.debug("Adding Fragment to page");
              const result = await fetchAndInjectFragment({
                dom: $,
                selector,
                app: ctx.dockui.app,
                module,
                logger,
                appService
              });
              logger.debug("Added Fragment to page");
              ctx.dockui.webPage.decoratedPage = $.html();
            }
          });
        });
        // Update the HTML
      }
    } catch (err) {
      logger.error("Failed to add Fragment to page, error = %o", err);
    }

    await next();
  };
};
