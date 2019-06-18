let cheerio = require("cheerio");

/**
 * @description Middleware function to strip out Page resources to the context
 *              and add resources provided by other Modules to the context too
 */
module.exports = function({ config, logger } = {}) {
  return async function addResourcesToContext(ctx, next) {
    logger.debug(
      "Strip Page Resources out of the HTML and add them to CTX for later"
    );
    // For each css, link, style, script tag parse it out for later.
    if (ctx.dockui.webPage && ctx.dockui.webPage.html) {
      try {
        const $ = cheerio.load(ctx.dockui.webPage.html);
        // TODO: Find all the types e.g. link,style,script and parse them out into
        // ctx.dockui.webPage.resources[{
        //   tag: "script",
        //   attributes: {"src" : "href://bla.com"}
        // },...]
        // Do this for every page in the stack starting with decorator up
        // Dont duplicate, so if same tag and src then skip.
      } catch (err) {
        logger.error("Error parsing current page: error = %o", err);
      }
    } else {
      logger.warn(
        "Trying to parse resources but there is no Page in the context - skipping"
      );
    }
    await next();
  };
};
