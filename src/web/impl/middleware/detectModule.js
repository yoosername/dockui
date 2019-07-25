const WebResourceModule = require("../../../app/module/impl/WebResourceModule");
/**
 * @description Return App if part = key, id or alias
 */
const getAppFromURLPart = async ({ part, appService, logger, ctx }) => {
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
    throw new Error(e);
  }
  if (apps && apps.length > 0) {
    return apps[0];
  } else {
    throw new Error("No App found with (id,key or alias) of " + part);
  }
};

const getModuleFromURLPart = async ({ part, appService, app, logger, ctx }) => {
  // When no module is specified it is assumed we want a module with alias of index
  if (part === "") part = "index";
  const modules = await appService.getModules(module => {
    logger.silly(
      "Testing Module URL (%s) against Module (key=%s,id=%s,aliases=%o) for AppID (%s)",
      part,
      module.getKey(),
      module.getId(),
      module.getAliases(),
      app.getId()
    );

    // Check that the module matches the appId supplied
    if (app.getId() !== module.getAppId()) {
      return false;
    }

    // First test if its simply the exact id or key of a module
    if (module.getKey() === part || module.getId() === part) {
      return true;
    }
    // If not then test if it matches any of the modules aliases (minus any querystring)
    const aliases = module.getAliases().slice();
    const minusQueryString = part.split("?")[0];

    if (aliases && aliases.length > 0) {
      for (var i = 0; i < aliases.length; i++) {
        if (aliases[i] === minusQueryString) {
          return true;
        }
      }
    }
    // If not then if this is a WebResource module type see if it matches the alias combined with any resources
    if (module.getType() === WebResourceModule.DESCRIPTOR_TYPE) {
      const resources = module.getResources();
      try {
        aliases.push(module.getId());
        aliases.push(module.getKey());
        const allPaths = [].concat
          .apply(
            [],
            aliases.map(a => {
              let t = [];
              resources.forEach(p => {
                // If p is static then make test more forgiving
                if (p.type === "static") {
                  t.push("(" + a + ")/(" + p.path + "[^?]*)");
                } else {
                  t.push("(" + a + ")/(" + p.path + ")");
                }
              });
              return t;
            })
          )
          .join("|")
          .replace(/([\-\.\/])/g, "\\$1");

        // Create regex to quickly test for all combinations of resource path
        const pathTester = new RegExp("^(" + allPaths + ")[?]{0,1}[^?]*$");
        if (pathTester.test(part)) {
          // To make it easier later add the specific part of the path for the resource to the ctx
          const groups = pathTester.exec(part).filter(i => i !== undefined);
          ctx.dockui.resourcePath = groups[groups.length - 1];
          return true;
        }
      } catch (err) {
        logger.error("Error matching resources error = %o", err);
      }
    }
  });
  if (modules && modules.length > 0) {
    // If the module is known return it, unless its disabled in which case throw
    const firstFoundModule = modules[0];
    if (!firstFoundModule.isEnabled()) {
      throw new Error(
        "Module with (key=" +
          firstFoundModule.getKey() +
          ") matched route (" +
          part +
          ") but is disabled"
      );
    }
    return modules[0];
  } else {
    throw {
      status: 404,
      message: "No Module found with (id,key or alias) of " + part
    };
  }
};
/**
 * @description Middleware function to Detect which App/Module(s) are being requested
 *              and add them to the CTX for later middleware to use.
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function detectModule(ctx, next) {
    // If ctx is not object yet create it
    ctx.dockui = ctx.dockui && typeof ctx.dockui === "object" ? ctx.dockui : {};

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
        app = await getAppFromURLPart({
          part: appPart,
          appService,
          logger,
          ctx
        });
        // Detect the Module ( alias, id or key )
        module = await getModuleFromURLPart({
          part: modulePart,
          appService,
          app,
          logger,
          ctx
        });
      } catch (e) {
        throw e;
      }
      // If we have them add them to the context
      if (app && module) {
        ctx.dockui.app = app;
        ctx.dockui.module = module;
        logger.debug(
          "Detected Request for App (%s) and Module (%s)",
          app.getId(),
          module.getId()
        );
      }
      // If the APp is diabled then throw here as shouldnt carry on
      if (!app.isEnabled()) {
        throw new Error(`App(key=${app.getKey()}) exists but is disabled`);
      }
    } else {
      throw new Error("Malformed URL - Expecting /app/(id||key||alias)[/.*]");
    }
    // Continue to next middlewares
    await next();
  };
};
