/**
 * @description Middleware function to Detect which App/Module(s) are being requested
 *              and add them to the CTX for later middleware to use.
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function detectModule(ctx, next) {
    const isAppModuleURL = new RegExp("^/app/([^/]+?)/([^/]+?)(?:/)?$");
    if (isAppModuleURL.test(ctx.originalUrl)) {
      const data = isAppModuleURL.exec(ctx.originalUrl);
      const appId = data[1];
      const app = await appService.getApp(appId);
      const moduleId = data[2];
      const module = await appService.getModule(moduleId);
      logger.debug(
        "Detected Request for App (%s) and Module (%s)",
        app.getId(),
        module.getId()
      );
      ctx.app = app;
      ctx.module = module;
    }
    await next();
  };
};
