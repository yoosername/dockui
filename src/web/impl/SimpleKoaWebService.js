const fs = require("fs");
const Koa = require("koa");
const Router = require("koa-router");
const https = require("https");
const WebService = require("../WebService");
const { Config } = require("../../config/Config");
const Logger = require("../../log/Logger");

// KOA Specific General Middleware
const serve = require("koa-static");
const mount = require("koa-mount");
const helmet = require("koa-helmet");
const bodyParser = require("koa-bodyparser");
//const ratelimit = require('koa-ratelimit');

// App Gateway Middleware
const indexRedirector = require("./middleware/indexRedirector");
const detectModule = require("./middleware/detectModule");
const cacheHandler = require("./middleware/cacheHandler");
const routeHandler = require("./middleware/routeHandler");
const idamDecorator = require("./middleware/idamDecorator");
const policyDecisionPoint = require("./middleware/policyDecisionPoint");
const authenticationHandler = require("./middleware/authenticationHandler");
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
    this.port = config ? config.get("web.port") : DEFAULT_PORT;
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
    const pageProxy = new Koa();
    const apiProxy = new Koa();
    const resourceProxy = new Koa();

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
    //   ctx.body = Object.assign(ctx.body, {
    //     links: [
    //       {
    //         rel: "self",
    //         href: "/objects/1"
    //       }
    //     ]
    //   });
    // });

    /*
     * Global Debug Logging
     */
    app.use(async (ctx, next) => {
      this.logger.debug("[%s] %o", ctx.method, ctx.originalUrl);
      await next();
    });

    /**
     * Apply common security headers using Helmet
     */
    app.use(helmet());
    this.logger.debug("Configured common security headers");

    /**
     * Add Rate limiting to prevent simple DOS issues
     */
    //app.use(ratelimit());

    /**
     * Add a body parser
     */
    app.use(bodyParser());

    /**
     * Module provided redirects
     * Checks if the current route should be redirected somewhere else
     */
    app.use(routeHandler(this));

    /**
     * Index Default Redirector (defaults to /app/home)
     * This can be set with DOCKUI_WEB_INDEX
     */
    app.use(indexRedirector(this));

    /**
     * Simple Health Endpoint
     */
    router.get("/health", async ctx => {
      ctx.body = { status: "running" };
    });
    this.logger.debug("Configured /health endpoint");

    /**
     * Built in DEMO App statically served
     */
    demoMount.use(serve(__dirname + "/static/demo"));
    app.use(mount("/demo", demoMount));

    /**
     * Raw Swagger API static JSON
     */
    router.get("/api/swagger.json", async ctx => {
      ctx.body = swaggerDocument;
    });

    /**
     * Raw Swagger UI
     */
    swaggerUIStaticMount.use(serve(__dirname + "/static/swagger"));
    app.use(mount("/api/", swaggerUIStaticMount));

    /**
     * DockUI Management Routes
     */

    // If Json incudes a DocType then we can auto add a self href into the JSON.
    // app.use(async (ctx, next) => {
    //   await next();
    //   console.log(ctx.body.docType);
    //   ctx.body = Object.assign(ctx.body, { _self: "cheese" });
    // });

    // TODO: Add endpoint for viewing tasks
    // Get array of all tasks : router.get("/api/manage/task");
    // Get single task (including status) : router.get("/api/manage/task/:id");

    // Load a new App
    router.post("/api/manage/app", async ctx => {
      const body = ctx.request.body;
      const { url, permission } = body;
      ctx.body = await this.appService.loadApp(url, permission);
    });

    // List all Apps ( or return a single app )
    router.get("/api/manage/app/:id*", async ctx => {
      if (ctx.params.id && ctx.params.id !== "") {
        const app = await this.appService.getApp(ctx.params.id);
        ctx.body = app;
      } else {
        ctx.body = await this.appService.getApps();
      }
    });

    // UnLoad an existing App
    router.delete("/api/manage/app/:id", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const app = await this.appService.getApp(ctx.params.id);
      ctx.body = await this.appService.unLoadApp(app);
    });

    // List all Modules ( or return a single Module by id )
    router.get("/api/manage/module/:moduleId*", async ctx => {
      if (ctx.params.moduleId && ctx.params.moduleId !== "") {
        ctx.body = await this.appService.getModule(ctx.params.moduleId);
      } else {
        ctx.body = await this.appService.getModules();
      }
    });

    // Enable an existing App
    router.put("/api/manage/app/:id/enable", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const app = await this.appService.getApp(ctx.params.id);
      ctx.body = await this.appService.enableApp(app);
    });

    // Disable an existing App
    router.put("/api/manage/app/:id/disable", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const app = await this.appService.getApp(ctx.params.id);
      ctx.body = await this.appService.disableApp(app);
    });

    // Enable an existing Module
    router.put("/api/manage/module/:id/enable", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const module = await this.appService.getModule(ctx.params.id);
      ctx.body = await this.appService.enableModule(module);
    });

    // Disable an existing Module
    router.put("/api/manage/module/:id/disable", async ctx => {
      if (!ctx.params.id) throw new Error("Missing param (id)");
      const module = await this.appService.getModule(ctx.params.id);
      ctx.body = await this.appService.disableModule(module);
    });

    /**
     * APP Gateway (proxies loaded and enabled apps Pages and Apis)
     * Base URL = /app
     **/

    // 1: Middleware to provide caching
    // appGateway.use(cacheHandler(this));

    // 2: Detect which App/Module is being requested and add to the CTX or throw
    appGateway.use(detectModule(this));

    // // 3: Middleware to map IDAM info against ctx (e.g. URN for user, webpage, policy = (grant all))
    // appGateway.use(idamDecorator(this));

    // // 4: Middleware to enforce policy (PDP) by delegating to authorisationproviders (using IDAM ctx)
    // // AuthorisationProviders have access to the Module config and IDAM user context but make the decision
    // // Based on some specific internal logic.
    // appGateway.use(policyDecisionPoint(this));

    // // 5: Middleware to authenticate a user if PDP requires it
    // appGateway.use(authenticationHandler(this));

    // // 6: '/app/page' Route for Pages (fetch page using app defined auth ((e.g. JWT)))
    // pageProxy.use(fetchPage(this));

    // //   a: Middleware to strip resources from page & module provided ones and add to ctx.resources
    // pageProxy.use(addResourcesToContext(this));

    // //   b: Middleware to check if Page needs decoration and replacing page with decorated one
    // pageProxy.use(decoratePage(this));

    // //   c: Middleware to combine ctx.resources back in to page
    // pageProxy.use(addResourcesFromContext(this));

    // //   d: Middleware to inject PageFragments into page
    // pageProxy.use(addPageFragments(this));

    // //   e: Middleware to inject PageItems into page
    // pageProxy.use(addPageItems(this));
    // appGateway.use(mount("/page", pageProxy));

    // // 7: '/app/resource' Route for Serving Static Resources (CSS, JS)
    // //   - direct reverse proxy
    // appGateway.use(mount("/resource", resourceProxy));

    // // 8: '/app/api' Route for Apis
    // //   - direct reverse proxy
    // appGateway.use(mount("/api", apiProxy));
    app.use(mount("/app", appGateway));

    this.logger.debug("Configured Management routes");
    app.use(router.routes());
    app.use(router.allowedMethods());

    // Show a 404 JSON based error for any unknown routes
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
