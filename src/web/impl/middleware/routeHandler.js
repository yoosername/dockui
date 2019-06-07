const RouteModule = require("../../../app/module/impl/RouteModule");

const getMatchingModuleRoutes = async ({ appService, logger }) => {
  // Return array of all Module specified routes which match the current route
  let allRouteModules,
    filtered = [];

  try {
    allRouteModules = await appService.getModules(module => {
      if (module.getType() === RouteModule.DESCRIPTOR_TYPE) {
        return true;
      }
    });
  } catch (e) {
    logger.error("Error searching for Route Modules: error=%o", e);
  }

  if (allRouteModules && allRouteModules.length > 0) {
    // Sort by the weights;
    allRouteModules.sort((prev, next) => {
      if (prev.getWeight && next.getWeight) {
        return prev.getWeight() - next.getWeight();
      }
      return 0;
    });
    try {
      filtered = [].concat.apply(
        [],
        allRouteModules.map(obj => {
          return obj.getRoutes();
        })
      );
    } catch (e) {
      logger.error(" There was a problem parsing Route Modules", e);
    }
  } else {
    logger.debug("No RouteModules found - skipping");
  }

  return filtered;
};

/**
 * @description Middleware function to handle App specific Routing
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function routeHandler(ctx, next) {
    const url = ctx.originalUrl;
    logger.debug("Looking for any Module Provided Routes");
    const matchingRoutes = await getMatchingModuleRoutes({
      appService,
      logger
    });
    if (matchingRoutes && matchingRoutes.length > 0) {
      logger.debug(
        "[%s] RouteModule provided Routes found (%o)",
        matchingRoutes.length,
        matchingRoutes
      );
      for (var r = 0; r < matchingRoutes.length; r++) {
        const regString = new RegExp(matchingRoutes[r].from);
        if (regString.test(url)) {
          return ctx.redirect(matchingRoutes[r].to);
        }
      }
    }
    await next();
  };
};
