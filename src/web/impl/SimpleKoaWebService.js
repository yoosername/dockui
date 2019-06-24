const fs = require("fs");
const Koa = require("koa");
const Router = require("koa-router");
const https = require("https");
const WebService = require("../WebService");
const { Config } = require("../../config/Config");
const Logger = require("../../log/Logger");
const jwt = require("jsonwebtoken");

// KOA Specific General Middleware
const serve = require("koa-static");
const mount = require("koa-mount");
const helmet = require("koa-helmet");
const bodyParser = require("koa-bodyparser");
const multer = require("koa-multer");
//const ratelimit = require('koa-ratelimit');

// App Gateway Middleware
const detectModule = require("./middleware/detectModule");
const cacheHandler = require("./middleware/cacheHandler");
const routeHandler = require("./middleware/routeHandler");
const idamDecorator = require("./middleware/idamDecorator");
const policyDecisionPoint = require("./middleware/policyDecisionPoint");
const authenticationHandler = require("./middleware/authenticationHandler");
const serveIfWebResource = require("./middleware/serveIfWebResource");
const serveIfApi = require("./middleware/serveIfApi");
const serveIfWebPage = require("./middleware/serveIfWebPage");
const fetchPage = require("./middleware/fetchPage");
const addResourcesToContext = require("./middleware/addResourcesToContext");
const addResourcesFromContext = require("./middleware/addResourcesFromContext");
const decoratePage = require("./middleware/decoratePage");
const addPageFragments = require("./middleware/addPageFragments");
const addPageItems = require("./middleware/addPageItems");

// Defaults
const DEFAULT_SCHEME = "http";
const DEFAULT_PORT = 3000;
const SSL_CERT_CONFIG_KEY = "web.ssl.cert";
const SSL_KEY_CONFIG_KEY = "web.ssl.key";

// Swagger Doc for API Docs
const swaggerDocument = require("./swagger/swagger.json");

/**
 * @description Wraps the intialization, configuration and starting/stopping of a web server
 *              and associated routes etc.
 */
class SimpleKoaWebService extends WebService {
  /**
   * @argument {AppService} appService The AppService for interacting with Apps
   * @argument {Config} config The optional runtime Config
   */
  constructor({
    appService,
    config = new Config(),
    logger = new Logger(config)
  } = {}) {
    super(...arguments);
    this.running = false;
    this.config = config;
    this.scheme =
      config && config.get("web.scheme")
        ? config.get("web.scheme")
        : DEFAULT_SCHEME;
    this.port =
      config && config.get("web.port") ? config.get("web.port") : DEFAULT_PORT;
    this.logger = logger.child({ config: { "service.name": "WebService" } });
    this.webApp = new Koa();
    this.router = new Router();
    this.server = null;
  }

  /**
   * @description setup required Middleware and Routes
   */
  setupMiddleware() {
    "use strict";

    const app = this.webApp;
    const router = this.router;
    const swaggerUIStaticMount = new Koa();
    const demoMount = new Koa();
    const appGateway = new Koa();

    /**
     * Global error handler
     */
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        const status = err.status || 500;
        ctx.status = status;
        ctx.body = { error: { status: status, message: err.message } };
        ctx.app.emit("error", err, ctx);
        this.logger.error(
          "error (status=%s) (message=%s)",
          status,
          err.message
        );
        if (err.status === 500) {
          this.logger.error("stack trace: %o", err);
        }
      }
    });

    // Add self links
    // app.use(async (ctx, next) => {
    //   await next();
    //   if (ctx.body && ctx.body.docType) {
    //     console.log(ctx.body.id);
    //     const docType = ctx.body.docType === "MODULE" ? "module" : "app";
    //     const id = ctx.body.id;
    //     ctx.body = Object.assign({}, ctx.body, {
    //       links: [
    //         {
    //           rel: "self",
    //           method: "GET",
    //           href: `/api/v1/admin/${docType}/${id}`
    //         },
    //         {
    //           rel: "create",
    //           method: "POST",
    //           title: `create ${docType}`,
    //           href: `/api/v1/admin/${docType}`
    //         }
    //       ]
    //     });
    //   }
    // });

    /*
     * Global Debug Logging
     */
    app.use(async (ctx, next) => {
      this.logger.debug("[%s] %o", ctx.method, ctx.originalUrl);
      await next();
    });

    /**
     * Apply common best practice security headers using Helmet
     */
    app.use(helmet());
    this.logger.debug("Configured common security headers");

    /**
     * Add Rate limiting to prevent simple DOS issues
     */
    //app.use(ratelimit());

    /**
     * Add a body parser for JSON based Api
     */
    app.use(bodyParser());

    /**
     * Simple Health Endpoint
     */
    router.get("/health", async ctx => {
      ctx.body = { status: "running" };
    });
    this.logger.debug("Configured /health endpoint");

    /**
     * -----------------------------------------------------------------------
     * Built in DEMO App with JWT based auth via authenticationProvider Module
     * -----------------------------------------------------------------------
     */
    // Add a Multipart body parser for the login page
    app.use(
      multer().fields([
        { name: "username", maxCount: 1 },
        { name: "password", maxCount: 1 }
      ])
    );
    // Mount the static HTML for the Demo
    demoMount.use(serve(__dirname + "/static/demo"));
    app.use(mount("/demo", demoMount));
    // Add some Hardcoded Demo Users
    const validDemoUsers = {
      user: {
        password: "user",
        token: null,
        roles: ["DASHBOARD_VIEW"]
      },
      admin: {
        password: "admin",
        token: null,
        roles: ["DASHBOARD_VIEW", "DASHBOARD_ADMIN"]
      }
    };
    // Provide the AuthenticationProvider endpoint
    router.post("/demo/identity_check", async ctx => {
      // See if there is a JWT Token with the admin user in it
      // If no token redirect
      await new Promise((resolve, reject) => {
        const authToken = ctx.request.body.cookies["X-Demo-Auth"];
        jwt.verify(
          authToken,
          "thisIsNotAVeryGoodSecret",
          (err, authorizedData) => {
            if (err) {
              // If no token or is token but error here, send 301 to log in
              ctx.status = 301;
              ctx.body = {
                status: 301,
                url: "/app/dashboard/login",
                message: "Login Required"
              };
              this.logger.debug(
                "No Token or Token Verify failure, send redirect to login page"
              );
              return resolve();
            } else {
              // If token is successfully verified, we can send the autorized data
              ctx.status = 200;
              ctx.body = {
                status: 200,
                message: "Success",
                headers: { Authorization: authToken },
                principle: authorizedData.username
              };
              this.logger.debug(
                "JWT Verified ok, user is (%s)",
                authorizedData
              );
              return resolve();
            }
          }
        );
      });
    });
    // Provide the Backing Controller for the Login form
    router.post("/demo/login.action", async ctx => {
      // get login details
      const { username, password } = ctx.request.body;
      this.logger.debug("User logged in as %s:%s", username, password);
      // check they match our demo users
      if (
        (username === "user" && password === "user") ||
        (username === "admin" && password === "admin")
      ) {
        // User logged in with a valid user
        this.logger.debug("Signing a freshly minted JWT Token");
        let self = this;
        try {
          await new Promise((resolve, reject) => {
            jwt.sign(
              { username },
              "thisIsNotAVeryGoodSecret",
              { expiresIn: "1h" },
              (err, token) => {
                if (err) {
                  this.logger.error("Error Signing JWT, error = %s", err);
                  return reject(err);
                }
                this.logger.debug("Setting cookies");
                validDemoUsers[username].token = token;
                let futureDate = new Date();
                ctx.cookies.set(
                  encodeURIComponent("X-Demo-Auth"),
                  encodeURIComponent(token),
                  {
                    maxAge: 604800,
                    expires: futureDate.setDate(futureDate.getDate() + 100),
                    httpOnly: false,
                    secure: false
                  }
                );
                this.logger.debug("Cookies: %o", ctx.headers.cookie);
                this.logger.debug(
                  "Token created as: %s",
                  validDemoUsers[username].token
                );
                resolve();
              }
            );
          });
        } catch (e) {
          return this.logger.error("Error Signing JWT, error = %s", e);
        }
      }
      // send a redirect to the location in the then query param
      this.logger.debug("Redirecting to %s", ctx.query.then);
      ctx.redirect(ctx.query.then);
    });
    // Provide the endpoint for the AuthorizationProvider
    router.post("/demo/permission_check", async ctx => {
      // Check the passed IDAM info and check the requested principle
      const { principle, target, policy, action } = ctx.request.body;
      const user = validDemoUsers[principle];
      const userRoles = user ? user.roles : [];
      // Are there any types of Role?
      if (policy && policy.length) {
        // if so for each one
        for (var i = 0; i < policy.length; i++) {
          // Check the type is a role one that we are interested in
          if (policy[i].type.toLowerCase() === "role") {
            // and if it is check if the current action is specified
            if (policy[i].action.includes(action)) {
              // and if it is check the user has the associated Role - if not send 403 - Forbidden
              if (userRoles.includes(policy[i].role)) {
                // nice  - user has the role so continue
                this.logger.debug(
                  "User (%s) has required Role (%s) to access restricted target (%s)",
                  user,
                  policy[i].role,
                  target
                );
              } else {
                return ctx.throw(
                  403,
                  "User (" +
                    principle +
                    ") doesnt have sufficient role (" +
                    policy[i].role +
                    ") to access this resource (" +
                    target +
                    ")"
                );
              }
            }
          }
        }
      }
      ctx.status = 200;
      ctx.body = { user: user };
    });
    router.get("/demo/rest/api/1.0/users", async ctx => {
      ctx.body = [
        { name: "dave", skill: "winning" },
        { name: "bob", skill: "losing" },
        { name: "ruby", skill: "standing" },
        { name: "tyrone", skill: "staring" }
      ];
    });
    this.logger.debug("Configured DEMO App");
    /**
     * -----------------------------------------------------------------------
     * End of DEMO - TODO: Move this to seperate project
     * -----------------------------------------------------------------------
     */

    /**
     * Raw Swagger API static JSON and Static UI
     */
    router.get("/api/swagger.json", async ctx => {
      ctx.body = swaggerDocument;
    });
    swaggerUIStaticMount.use(serve(__dirname + "/static/swagger"));
    app.use(mount("/api/", swaggerUIStaticMount));
    this.logger.debug("Configured Swagger UI @ /api");

    /**
     * DockUI Framework Admin Routes
     */

    // TODO: Add endpoint for viewing tasks
    // Get array of all tasks : router.get("/api/manage/task");
    // Get single task (including status) : router.get("/api/manage/task/:id");

    // Load a new App
    router.post("/api/v1/admin/app", async ctx => {
      const body = ctx.request.body;
      const { url, permission } = body;
      ctx.body = await this.appService.loadApp(url, permission);
    });

    // List all Apps ( or return a single app )
    router.get("/api/v1/admin/app/:id*", async ctx => {
      if (ctx.params.id && ctx.params.id !== "") {
        const app = await this.appService.getApp(ctx.params.id);
        ctx.body = app;
      } else {
        ctx.body = await this.appService.getApps();
      }
    });

    // UnLoad an existing App
    router.delete("/api/v1/admin/app/:id", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const app = await this.appService.getApp(ctx.params.id);
      ctx.body = await this.appService.unLoadApp(app);
    });

    // ReLoad an Existing App (Should keep ID and App should be notified)
    router.put("/api/v1/admin/app/:id/reload", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const app = await this.appService.getApp(ctx.params.id);
      const optionalPermission =
        ctx.request.body && ctx.request.body.permission
          ? ctx.request.body.permission
          : ctx.request.query.permission;
      ctx.body = await this.appService.reloadApp(app, optionalPermission);
    });

    // List all Modules ( or return a single Module by id )
    router.get("/api/v1/admin/module/:moduleId*", async ctx => {
      if (ctx.params.moduleId && ctx.params.moduleId !== "") {
        ctx.body = await this.appService.getModule(ctx.params.moduleId);
      } else {
        ctx.body = await this.appService.getModules();
      }
    });

    // Enable an existing App
    router.put("/api/v1/admin/app/:id/enable", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const app = await this.appService.getApp(ctx.params.id);
      ctx.body = await this.appService.enableApp(app);
    });

    // Disable an existing App
    router.put("/api/v1/admin/app/:id/disable", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const app = await this.appService.getApp(ctx.params.id);
      ctx.body = await this.appService.disableApp(app);
    });

    // Enable an existing Module
    router.put("/api/v1/admin/module/:id/enable", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const module = await this.appService.getModule(ctx.params.id);
      ctx.body = await this.appService.enableModule(module);
    });

    // Disable an existing Module
    router.put("/api/v1/admin/module/:id/disable", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const module = await this.appService.getModule(ctx.params.id);
      ctx.body = await this.appService.disableModule(module);
    });
    this.logger.debug("Configured Management routes");

    /**
     * App Gateway Middleware
     **/

    /**
     * @description Middleware to provide routing
     *              Checks if there are any enabled Route modules and picks the first
     *              one which a route that matches (ordered by weight) and redirects to it
     */
    app.use(routeHandler(this));

    /**
     * @description Middleware to provide caching
     *              On request - check if cache for requested URL and serve unless cache timed out
     *              On response - check if requested Module has caching enabled and if so cache it
     */
    appGateway.use(cacheHandler(this));

    // 2: Detect which App/Module is being requested and add to the CTX or throw
    appGateway.use(detectModule(this));

    // 3: Map IDAM info against ctx (e.g. URN for user, webpage, policy = (grant all))
    appGateway.use(idamDecorator(this));

    // 4: Check a users auth if context.dockui.auth is not null
    //    - If user not authenticated and required - do authentication steps
    //    - If user authenticated validate it and update context.dockui.auth with
    //       principle info and optionally a user object
    appGateway.use(authenticationHandler(this));

    // 5: Enforce policy (PDP) by delegating to authorisationproviders (using IDAM ctx)
    //    AuthorisationProviders have access to the Module config and IDAM user context but make the decision
    //    Based on some specific internal logic.
    //    - If no auth settings pass through
    //    - if auth settings we can only get here if a user has been verified and added to idam ctx
    appGateway.use(policyDecisionPoint(this));

    /**
     * App Gateway
     **/
    // If module Type is WebResource then fetch and stream result to originator
    appGateway.use(serveIfWebResource(this));
    // If module Type is API then fetch and stream result to originator
    appGateway.use(serveIfApi(this));

    // If module Type is WebPage then perform these steps
    // 1: Fetch the page (GET/POST) - with replicated headers - and add result to dockui.webPage.stack
    // 1b: Check if it has a decortator - if yes fetch and add to stack - if no return
    // 1c: repeat
    appGateway.use(fetchPage(this));

    // 2a: Strip resources from each page in the stack (dedupe) and add to ctx.dockui.resources
    // 2b: Add Module specified Resources to ctx.dockui.resources
    appGateway.use(addResourcesToContext(this));

    // 3: Recombine the stack of pages into a single decorated page
    appGateway.use(decoratePage(this));

    // 4a: Fetch any known WebFragments which target this page
    // 4b: Inject Fragments into ctx.dockui.page at the target locations
    appGateway.use(addPageFragments(this));

    // 5: Build and inject any required WebItems into ctx.dockui.page
    appGateway.use(addPageItems(this));

    // 6: Filter and Sort ctx.dockui.resources and inject back into ctx.dockui.page
    appGateway.use(addResourcesFromContext(this));

    // 7: Serve the resulting page to client
    appGateway.use(serveIfWebPage(this));

    // Mount the app middle to the /app context
    app.use(mount("/app", appGateway));

    // Add all the Router configured routes to the main app
    this.logger.debug("Configured App Gateway routes");
    app.use(router.routes());
    app.use(router.allowedMethods());

    /**
     * At this point all routes have been exhausted, so must be a 404
     **/
    app.use(ctx => {
      ctx.throw(404); // throw 404s after all routers try to route this request
    });

    this.middleWareConfigured = true;
  }

  /**
   * @description initialize and start web server
   */
  async start() {
    "use strict";
    return new Promise(async (resolve, reject) => {
      // First setup the middleware
      if (!this.middleWareConfigured) {
        this.setupMiddleware();
      }

      // Start App if not already
      if (!this.server && !this.isRunning()) {
        try {
          if (this.scheme === "https") {
            const cert = this.config.get(SSL_CERT_CONFIG_KEY);
            const key = this.config.get(SSL_KEY_CONFIG_KEY);
            if (!cert || !key) {
              throw new Error(
                "Cannot start webservice on https, Missing cert and key"
              );
            }
            this.server = await https
              .createServer(
                {
                  cert: fs.readFileSync(cert),
                  key: fs.readFileSync(key),
                  ciphers: [
                    "ECDHE-RSA-AES128-SHA256",
                    "DHE-RSA-AES128-SHA256",
                    "AES128-GCM-SHA256",
                    "RC4",
                    "HIGH",
                    "!MD5",
                    "!aNULL"
                  ].join(":")
                },
                this.webApp.callback()
              )
              .listen(this.getPort());
          } else {
            this.server = await this.webApp.listen(this.getPort());
          }
          // Add error event handler
          this.server.on("error", err => {
            this.logger.error("Web Service encountered an error: %o", err);
          });

          // Set that we are running and log success
          this.running = true;
          this.logger.info(
            "Web Service has started at %s://localhost:%d/",
            this.scheme,
            this.getPort()
          );
        } catch (e) {
          this.logger.error("Web Service didnt start: %o", e);
          reject(e);
        }
      }
      // And we are done
      resolve(this.server);
    });
  }

  /**
   * @description Gracefully shutdown web server
   */
  async shutdown() {
    "use strict";
    //stop server and emit event
    return new Promise(async (resolve, reject) => {
      await this.getServer().close();
      this.running = false;
      resolve();
    });
  }

  /**
   * @description Is the webserver currently serving requests
   * @returns {Boolean} Returns true if the WebService is currently running
   */
  isRunning() {
    "use strict";
    return this.running;
  }

  /**
   * @description Helper to get the configured port
   * @returns {int} port
   */
  getPort() {
    "use strict";
    return this.port;
  }

  /**
   * @description Helper to get the underlying configured WebApp
   * @returns {Object} webApp
   */
  getWebApp() {
    "use strict";
    return this.webApp;
  }

  /**
   * @description Helper to get the underlying Router
   * @returns {Object} router
   */
  getRouter() {
    "use strict";
    return this.router;
  }

  /**
   * @description Helper to get the underlying Server instance
   * @returns {Object} server
   */
  getServer() {
    "use strict";
    return this.server;
  }
}

module.exports = SimpleKoaWebService;
