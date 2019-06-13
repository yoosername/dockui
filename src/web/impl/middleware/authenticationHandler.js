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
    const url = ctx.originalUrl;
    // - Check a users auth if context.dockui.auth is not null
    if (
      ctx.dockui &&
      ctx.dockui.idam !== null &&
      ctx.dockui.idam.policy &&
      (ctx.dockui.idam.policy !== undefined &&
        ctx.dockui.idam.policy !== "" &&
        ctx.dockui.idam.policy !== null)
    ) {
      //    - If user not authenticated and required - do authentication steps
      let authModules = await appService.getModules(
        module =>
          module.getType() === AuthenticationProviderModule.DESCRIPTOR_TYPE
      );

      authModules = authModules
        .filter(module => {
          return module.isEnabled() === true;
        })
        .sort((a, b) => {
          return a.getWeight() - b.getWeight();
        });

      if (authModules && authModules.length > 0) {
        logger.debug(
          "Authentication required for module(%s) - Trying %d providers",
          ctx.dockui.module.getKey(),
          authModules.length
        );

        const authModuleAppId = authModules[0].getAppId();
        const moduleURL = authModules[0].getUrl();
        const app = await appService.getApp(authModuleAppId);
        const appBaseURL = app.getBaseUrl();
        const appBasePath = new URL(appBaseURL).pathname;
        const normalizedPath = path.normalize(appBasePath + moduleURL);
        const authURL = new URL(normalizedPath, appBaseURL);

        const getCookies = context => {
          let cookies = [],
            cookie = {};
          const cookieHeader = context.headers.cookie;
          if (cookieHeader) {
            cookies = cookieHeader.split(";");
            cookies.forEach(function(item) {
              const crumbs = item.split("=");
              if (crumbs.length > 1)
                cookie[crumbs[0].trim()] = crumbs[1].trim();
            });
          }
          return cookie;
        };
        // Create the Auth Assertion info with url and headers
        let options = {
          method: "POST",
          uri: authURL.href,
          simple: false,
          body: {
            url: url,
            headers: ctx.request.headers,
            cookies: getCookies(ctx)
          },
          resolveWithFullResponse: true,
          json: true
        };
        //logger.debug(" Requesting Auth with options: %o", options);
        // For each Auth Module (sorted on weight)
        // Make the request
        try {
          const result = await defaultFetcher(options);
          logger.debug(
            "Result = %o, body = %o, REdirect URI = ",
            result.statusCode,
            result.body,
            result.body.url
          );
          if (result.statusCode === 302 || result.statusCode === 301) {
            const thenUrl = result.body.url + "?then=" + url;
            logger.debug("Redirecting to %s", thenUrl);
            return ctx.redirect(thenUrl);
          }
          if (result.statusCode === 200) {
            const headers = result.body.headers;
            const principle = result.body.principle;
            if (headers && headers.length > 0) {
              headers.forEach(header => {
                ctx.set(header, headers[header]);
              });
            }
            ctx.dockui.idam.principle = principle;
            logger.debug("User session is valid, headers(%o)", headers);
          }
          if (result.statusCode === 401) {
            return ctx.throw(401, "Access is Denied for this user");
          }
        } catch (err) {
          logger.warn(
            "Authentication request failed with status other than 401",
            err
          );
        }
        //     if returns 405 - try next
        //     if returns 200 - add passed headers and body
        //     if returns 301 - send the redirect
        // {
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
      ctx.dockui.idam.principle = "guest";
    }
    await next();
  };
};
