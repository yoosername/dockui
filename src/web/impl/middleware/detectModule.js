/**
 * @description Return App if part = key, id or alias
 */
const getAppFromURLPart = async ({ part, appService, logger }) => {
  let apps;
  try {
    apps = await appService.getApps(app => {
      if (
        app.getKey() === part ||
        app.getId() === part ||
        app.getAlias() === part
      ) {
        return true;
      }
    });
  } catch (e) {
    throw e;
  }
  if (apps && apps.length > 0) {
    return apps[0];
  } else {
    throw new Error("No App found with (id,key or alias) of " + part);
  }
};

const getModuleFromURLPart = async ({ part, appService, logger }) => {
  // When no module is specified it is assumed we want a module with alias of index
  if (part === "") part = "index";
  const modules = await appService.getModules(module => {
    logger.debug(
      "Testing Module URL (%s) against Module (key=%s,id=%s,aliases=%o)",
      part,
      module.getKey(),
      module.getId(),
      module.getAliases()
    );
    if (module.getKey() === part || module.getId() === part) {
      return true;
    }
    const aliases = module.getAliases();
    if (aliases && aliases.length > 0) {
      for (var i = 0; i < aliases.length; i++) {
        if (aliases[i] === part) {
          return true;
        }
      }
    }
  });
  if (modules && modules.length > 0) {
    return modules[0];
  } else {
    throw new Error("No Module found with (id,key or alias) of " + part);
  }
};
/**
 * @description Middleware function to Detect which App/Module(s) are being requested
 *              and add them to the CTX for later middleware to use.
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function detectModule(ctx, next) {
    // If it isnt an /app[/.*/.*] style url then reject
    const isAppModuleRegex = new RegExp(
      "^/app/([^/]+)([/]{0,1})([^?]*)([?]{0,1})([^#]*)([#]{0,1})(.*)$"
    );
    const isAppModuleURL = isAppModuleRegex.test(ctx.originalUrl);
    if (isAppModuleURL) {
      // Get the App and Module groups
      const data = isAppModuleRegex.exec(ctx.originalUrl);
      const appPart = data[1];
      const modulePart = data[3];
      let app,
        module = null;

      try {
        // Detect the App ( alias, id or key )
        app = await getAppFromURLPart({ part: appPart, appService, logger });
        // Detect the Module ( alias, id or key )
        module = await getModuleFromURLPart({
          part: modulePart,
          appService,
          logger
        });
      } catch (e) {
        throw e;
      }
      // If we have them add them to the context
      if (app && module) {
        ctx.dockui = { app, module };
        logger.debug(
          "Detected Request for App (%s) and Module (%s)",
          app.getId(),
          module.getId()
        );
      }
    } else {
      throw new Error("Malformed URL - Expecting /app/(id||key||alias)[/.*]");
    }
    // Continue to next middlewares
    await next();
  };
};
