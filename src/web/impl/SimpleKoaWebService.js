const Koa = require("koa");
const Router = require("koa-router");
const serve = require("koa-static");
const mount = require("koa-mount");
const helmet = require("koa-helmet");
const bodyParser = require("koa-bodyparser");
const addTrailingSlashes = require("koa-add-trailing-slashes");
const swaggerDocument = require("./swagger/swagger.json");
const DEFAULT_PORT = 3000;
const WebService = require("../WebService");
const { Config } = require("../../config/Config");
const Logger = require("../../log/Logger");

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

    /**
     * Add missing trailing slashes
     */
    //app.use(addTrailingSlashes());

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
        this.logger.error("error %o %o", err, ctx);
      }
    });

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
     * Add a body parser
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
     * Built in DEMO App Descriptor
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

    // Load a new App
    router.post("/api/manage/app", async ctx => {
      const body = ctx.request.body;
      const { url, permission } = body;
      ctx.body = await this.appService.loadApp(url, permission);
    });

    // List all Apps ( or return a single app )
    router.get("/api/manage/app/:id*", async ctx => {
      if (ctx.params.id && ctx.params.id !== "") {
        ctx.body = await this.appService.getApp(ctx.params.id);
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
          this.server = await this.webApp
            .listen(this.getPort())
            .on("error", err => {
              this.logger.error("Web Service encountered an error: %o", err);
            });
          this.running = true;
          this.logger.info(
            "Web Service has started on port %d",
            this.getPort()
          );
        } catch (e) {
          this.logger.error("Web Service didnt start: %o", e);
          return reject(e);
        }
      }
      // Emit local started event
      // Set isRunning
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
      this.getServer().close();
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
