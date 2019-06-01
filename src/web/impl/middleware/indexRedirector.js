const DEFAULT_INDEX = "/app/dashboard";

/**
 * @description Middleware function to redirect requests to the root to a
 *              specified app URL ( Defaults to /app/dashboard )
 */
module.exports = function({ config } = {}) {
  let ref = config && config.get ? config.get("web.index") : DEFAULT_INDEX;
  ref = ref ? ref : DEFAULT_INDEX;

  return async function indexRedirector(ctx, next) {
    if (ctx.request.path === "/") {
      return ctx.redirect(ref);
    } else {
      await next();
    }
  };
};
