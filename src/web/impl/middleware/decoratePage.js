const cheerio = require("cheerio");

const recombinePages = stack => {
  let flatPage = "";

  // Reverse the stack
  stack = stack.reverse();

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
        } else {
        }
      }
    });
  } catch (err) {}
  return flatPage;
};
/**
 * @description Middleware function to Recombine the stack of pages into a single decorated page
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
