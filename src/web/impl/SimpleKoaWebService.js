const Koa = require("koa");
const Router = require("koa-router");
const serve = require("koa-static");
const mount = require("koa-mount");
const helmet = require("koa-helmet");
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
    this.setupMiddleware();
  }

  /**
   * @description setup required Middleware and Routes
   */
  setupMiddleware() {
    "use strict";

    const app = this.webApp;
    const router = this.router;
    const swaggerUIStaticMount = new Koa();

    /**
     * Global error handler
     */
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
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
     * Simple Health Endpoint
     */
    router.get("/health", async ctx => {
      ctx.body = { status: "running" };
    });
    this.logger.debug("Configured /health endpoint");

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
    // List all Apps
    router.get("/api/admin/app", async ctx => {
      try {
        ctx.body = this.appService.getApps();
      } catch (err) {
        this.logger.error("Cannot communicate with AppService");
        throw new Error("Cannot communicate with AppService");
      }
    });

    // // Load a new App (or pass App Key or UUID to Reload an existing one )
    // router.post("/api/admin/app", (req, res) => {
    //   let newRequest = {
    //     requestId: uuidv4(),
    //     url: req.body.url,
    //     permission: req.body.permission
    //   };
    //   if (req.body.uuid) newRequest.uuid = req.body.uuid;
    //   this.eventService.emit(URL_APP_LOAD_REQUEST, newRequest);
    //   res.json(newRequest);
    // });

    // // get a single App by uuid or key
    // router.get("/api/admin/app/:id", (req, res) => {
    //   const id = req.params.id;
    //   res.json(this.appService.getApp(id));
    // });

    // // UnLoad an existing App
    // router.delete("/api/admin/app/:id", (req, res) => {
    //   const id = req.params.id;
    //   // Check it exists first
    //   if (!this.appService.getApp(id)) {
    //     return res.status(404).json({
    //       code: 404,
    //       type: "unknown_app_error",
    //       message: "Cannot find App with the provided UUID or Key"
    //     });
    //   }

    //   let newRequest = {
    //     requestId: uuidv4(),
    //     uuid: req.param.id
    //   };
    //   this.eventService.emit(URL_APP_UNLOAD_REQUEST, newRequest);
    //   res.json(newRequest);
    // });

    // // get a single Apps modules
    // router.get("/api/admin/app/:id/modules", (req, res) => {
    //   const id = req.params.id;
    //   const app = this.appService.getApp(id);
    //   if (app) {
    //     res.json(app.getModules());
    //   } else {
    //     res.status(404).json({
    //       code: 404,
    //       type: "unknown_app_error",
    //       message: "Cannot find App with the provided UUID or Key"
    //     });
    //   }
    // });

    // // Enable an App
    // router.put("/api/admin/app/:id/enable", (req, res) => {
    //   const id = req.params.id;
    //   const app = this.appService.getApp(id);
    //   if (app) {
    //     app.enable();
    //     res.status(200).json({
    //       code: 200,
    //       type: "app_enabled",
    //       message: `Enabled App ${app.getName()} successfully`
    //     });
    //   } else {
    //     res.status(404).json({
    //       code: 404,
    //       type: "unknown_app_error",
    //       message: "Cannot find App with the provided UUID or Key"
    //     });
    //   }
    // });

    // // Disable an App
    // router.put("/api/admin/app/:id/disable", (req, res) => {
    //   const id = req.params.id;
    //   const app = this.appService.getApp(id);
    //   if (app) {
    //     app.disable();
    //     res.status(200).json({
    //       code: 200,
    //       type: "app_disabled",
    //       message: `Disabled App ${app.getName()} successfully`
    //     });
    //   } else {
    //     res.status(404).json({
    //       code: 404,
    //       type: "unknown_app_error",
    //       message: "Cannot find App with the provided UUID or Key"
    //     });
    //   }
    // });

    // // Enable a Module
    // router.put("/api/admin/app/:id/modules/:moduleId/enable", (req, res) => {
    //   const id = req.params.id;
    //   const moduleId = req.params.moduleId;
    //   const app = this.appService.getApp(id);
    //   if (app) {
    //     const module = app.getModule(moduleId);
    //     if (module) {
    //       module.enable();
    //       res.status(200).json({
    //         code: 200,
    //         type: "app_enabled",
    //         message: `Enabled Module ${module.getName()} in App ${app.getName()} successfully`
    //       });
    //     } else {
    //       res.status(404).json({
    //         code: 404,
    //         type: "unknown_module_error",
    //         message: "Cannot find Module with the provided UUID or Key"
    //       });
    //     }
    //   } else {
    //     res.status(404).json({
    //       code: 404,
    //       type: "unknown_app_error",
    //       message: "Cannot find App with the provided UUID or Key"
    //     });
    //   }
    // });

    // // Disable a Module
    // router.put("/api/admin/app/:id/modules/:moduleId/disable", (req, res) => {
    //   const id = req.params.id;
    //   const moduleId = req.params.moduleId;
    //   const app = this.appService.getApp(id);
    //   if (app) {
    //     const module = app.getModule(moduleId);
    //     if (module) {
    //       module.disable();
    //       res.status(200).json({
    //         code: 200,
    //         type: "app_disabled",
    //         message: `Disabled Module ${module.getName()} in App ${app.getName()} successfully`
    //       });
    //     } else {
    //       res.status(404).json({
    //         code: 404,
    //         type: "unknown_module_error",
    //         message: "Cannot find Module with the provided UUID or Key"
    //       });
    //     }
    //   } else {
    //     res.status(404).json({
    //       code: 404,
    //       type: "unknown_app_error",
    //       message: "Cannot find App with the provided UUID or Key"
    //     });
    //   }
    // });

    this.logger.debug("Configured Management routes");
    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  /**
   * @description initialize and start web server
   */
  async start() {
    "use strict";
    return new Promise(async (resolve, reject) => {
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
