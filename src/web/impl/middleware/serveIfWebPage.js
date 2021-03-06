/**
 * @description Middleware function to detect decorated page and serve it
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function serveIfWebPage(ctx, next) {
    logger.debug("Checking if there is a WebPage to serve");

    // If There is a pre built webPage on the context just serve it
    if (ctx.dockui && ctx.dockui.webPage && ctx.dockui.webPage.decoratedPage) {
      const page = ctx.dockui.webPage.decoratedPage;
      logger.debug("WebPage found - serving to client");
      return (ctx.body = page);
    }

    // Otherwise just carry on
    await next();
  };
};
