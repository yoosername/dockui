let cheerio = require("cheerio");

const recombinePages = stack => {
  let flatPage = "";
  try {
    stack.forEach(page => {
      // First time
      if (flatPage === "") {
        flatPage = page;
      } else {
        const $decorator = cheerio.load(flatPage);
        const $child = cheerio.load(page);
        // If $decorator has a data-content div then inject the next page into it
        if ($decorator("[data-content]")) {
          $decorator("[data-content]")
            .removeAttr("data-content")
            .html($child("body").html());
          // Now decorator contains child, update static
          flatPage = $decorator.html();
        }
      }
    });
  } catch (err) {
    console.log("Error recombining page: ", err);
    // Worst case just return what we have
  }
  return flatPage;
};
/**
 * @description Middleware function to Check if a Page requires decoration and if so
 *              fetching it and decorating it
 */
module.exports = function({ config, logger } = {}) {
  return async function decoratePage(ctx, next) {
    logger.debug("Recombining Page stack into single decorated page");
    if (ctx.dockui.webPage.stack && ctx.dockui.webPage.stack.length > 1) {
      const flatPage = recombinePages(ctx.dockui.webPage.stack);
      ctx.dockui.webPage.decoratedPage = flatPage;
    } else {
      ctx.dockui.webPage.decoratedPage =
        ctx.dockui.webPage.stack[ctx.dockui.webPage.stack.length - 1];
    }
    await next();
  };
};
