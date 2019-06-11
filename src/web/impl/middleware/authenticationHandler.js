const AuthenticationProviderModule = require("../../../app/module/impl/AuthenticationProviderModule");
const request = require("request-promise-native");
const path = require("path");

const defaultFetcher = async options => {
  let data = {};

  try {
    if (options.uri.startsWith("https")) {
      const cert = this.config.get("web.ssl.cert");
      const key = this.config.get("web.ssl.key");
      if (cert && cert !== "" && (key && key !== "")) {
        options.cert = fs.readFileSync(cert);
        options.key = fs.readFileSync(key);
      } else {
        throw new Error(
          "In order to load a Https URL you must provide a cert, key in the config"
        );
      }
    }
    data = await request(options);
  } catch (e) {
    throw new Error(
      `Error fetching Descriptor communicating with AuthenticationProvider service with options(${options}) Error: ${e}`
    );
  }
  return data;
};

/**
 * @description Middleware function to redirect a user to a Login service
 *              - This could also be provided e.g. as a login page and backing Api
 *              - Or it could redirect to an IDP for a SAML based flow etc
 */
module.exports = function({ appService, logger } = {}) {
  return async function authenticationHandler(ctx, next) {
    logger.debug("Testing for Authentication");
    // - Check a users auth if context.dockui.auth is not null
    if (
      ctx.dockui &&
      ctx.dockui.idam !== null &&
      ctx.dockui.idam !== undefined
    ) {
      //    - If user not authenticated and required - do authentication steps
      const authModules = await appService.getModules(
        module =>
          module.getType() === AuthenticationProviderModule.DESCRIPTOR_TYPE
      );
      if (authModules && authModules.length > 0) {
        logger.debug(
          "Authentication required for module(%s) - Trying %d providers",
          ctx.dockui.module.getKey(),
          authModules.length
        );
        // Order by weight and then for each:
        //     if returns 405 - try next
        //     if returns 200 - add passed headers and body
        //     if returns 301 - send the redirect
        // {
        const authModuleAppId = authModules[0].getAppId();
        const moduleURL = authModules[0].getUrl();
        const app = await appService.getApp(authModuleAppId);
        const appBaseURL = app.getBaseUrl();
        const appBasePath = new URL(appBaseURL).pathname;
        const normalizedPath = path.normalize(appBasePath + moduleURL);
        const authURL = new URL(normalizedPath, appBaseURL);
        let options = {
          method: "POST",
          uri: authURL.href,
          body: { somethong: "noice" },
          json: true
        };
        console.log(options);
        const result = await defaultFetcher(options);
        console.log("Result = %o", result);
        //   url: /relative/url/being/requested?withParams,
        //   headers: [All Headers]
        // }
      } else {
        logger.error(
          "Authentication required to access Module(%s) but there are no AuthenticationProvider Modules enabled",
          ctx.dockui.module.getKey()
        );
        return ctx.throw(401, "Unauthorized");
      }
      //    - If user authenticated validate it and update context.dockui.auth with
      //       principle info and optionally a user object
    } else {
      logger.debug(
        "Authentication not required for module(%s)",
        ctx.dockui.module.getKey()
      );
    }
    await next();
  };
};
