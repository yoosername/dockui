/**
 * @description Middleware function to setup DockUI specific config on the Context etc
 */
module.exports = function({ config, logger } = {}) {
  return async function cache(ctx, next) {
    ctx.dockui = {};
    await next();
  };
};
