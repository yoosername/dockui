const uuidv4 = require("uuid/v4");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./admin/swagger.json");
let bodyParser = require("body-parser");

const swaggerOptions = {
  explorer: true
};

const WEBSERVICE_PORT = 3000;

const {
  WEBSERVICE_STARTING_EVENT,
  WEBSERVICE_STARTED_EVENT,
  WEBSERVICE_SHUTTING_DOWN_EVENT,
  WEBSERVICE_SHUTDOWN_EVENT,
  URL_APP_LOAD_REQUEST,
  URL_APP_UNLOAD_REQUEST
} = require("../../constants/events");

const { validateShapes } = require("../../util/validate");
const WebService = require("../WebService");

/**
 * @description Wraps the intialization, configuration and starting/stopping of a web server
 *              and associated routes etc.
 */
class DefaultWebService extends WebService {
  /**
   * @argument {AppService} appService The AppService for interacting with Apps
   * @argument {EventService} eventService The EventService to use for web events
   */
  constructor(appService, eventService) {
    super(appService, eventService);
    this.running = false;
    this.expressApp = express();
    this.setupMiddleware();
  }

  /**
   * @description setup required Middleware and Routes
   */
  setupMiddleware() {
    "use strict";

    /**
     * Swagger UI Middleware
     */
    this.expressApp.use(
      "/api/admin/doc",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, swaggerOptions)
    );

    /**
     * Standard BodyParser Middleware
     */
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: true }));
    this.expressApp.use(bodyParser.text());
    this.expressApp.use(bodyParser.json({ type: "application/json" }));

    /**
     * CLI Admin Authentication Handler
     *  Before we have any AuthenticationHandler modules in the system
     *  we still only want priviledged entities to make changes
     *  so we authenticate requests using a root ACCESS_TOKEN which is
     *  granted the first time a DockUI instance is created.
     */

    /**
     * DockUI Management Routes
     */
    // List all Apps
    this.expressApp.get("/api/admin/app", (req, res) => {
      res.json(this.appService.getApps());
    });

    // Load a new App (or pass App Key or UUID to Reload an existing one )
    this.expressApp.post("/api/admin/app", (req, res) => {
      let newRequest = {
        requestId: uuidv4(),
        url: req.body.url,
        permission: req.body.permission
      };
      if (req.body.uuid) newRequest.uuid = req.body.uuid;
      this.eventService.emit(URL_APP_LOAD_REQUEST, newRequest);
      res.json(newRequest);
    });

    // get a single App by uuid or key
    this.expressApp.get("/api/admin/app/:id", (req, res) => {
      const id = req.params.id;
      res.json(this.appService.getApp(id));
    });

    // UnLoad an existing App
    this.expressApp.delete("/api/admin/app/:id", (req, res) => {
      const id = req.params.id;
      // Check it exists first
      if (!this.appService.getApp(id)) {
        return res.status(404).json({
          code: 404,
          type: "unknown_app_error",
          message: "Cannot find App with the provided UUID or Key"
        });
      }

      let newRequest = {
        requestId: uuidv4(),
        uuid: req.param.id
      };
      this.eventService.emit(URL_APP_UNLOAD_REQUEST, newRequest);
      res.json(newRequest);
    });

    // get a single Apps modules
    this.expressApp.get("/api/admin/app/:id/modules", (req, res) => {
      const id = req.params.id;
      const app = this.appService.getApp(id);
      if (app) {
        res.json(app.getModules());
      } else {
        res.status(404).json({
          code: 404,
          type: "unknown_app_error",
          message: "Cannot find App with the provided UUID or Key"
        });
      }
    });

    // Enable an App
    this.expressApp.put("/api/admin/app/:id/enable", (req, res) => {
      const id = req.params.id;
      const app = this.appService.getApp(id);
      if (app) {
        app.enable();
        res.status(200).json({
          code: 200,
          type: "app_enabled",
          message: `Enabled App ${app.getName()} successfully`
        });
      } else {
        res.status(404).json({
          code: 404,
          type: "unknown_app_error",
          message: "Cannot find App with the provided UUID or Key"
        });
      }
    });

    // Disable an App
    this.expressApp.put("/api/admin/app/:id/disable", (req, res) => {
      const id = req.params.id;
      const app = this.appService.getApp(id);
      if (app) {
        app.disable();
        res.status(200).json({
          code: 200,
          type: "app_disabled",
          message: `Disabled App ${app.getName()} successfully`
        });
      } else {
        res.status(404).json({
          code: 404,
          type: "unknown_app_error",
          message: "Cannot find App with the provided UUID or Key"
        });
      }
    });

    // Enable a Module
    this.expressApp.put(
      "/api/admin/app/:id/modules/:moduleId/enable",
      (req, res) => {
        const id = req.params.id;
        const moduleId = req.params.moduleId;
        const app = this.appService.getApp(id);
        if (app) {
          const module = app.getModule(moduleId);
          if (module) {
            module.enable();
            res.status(200).json({
              code: 200,
              type: "app_enabled",
              message: `Enabled Module ${module.getName()} in App ${app.getName()} successfully`
            });
          } else {
            res.status(404).json({
              code: 404,
              type: "unknown_module_error",
              message: "Cannot find Module with the provided UUID or Key"
            });
          }
        } else {
          res.status(404).json({
            code: 404,
            type: "unknown_app_error",
            message: "Cannot find App with the provided UUID or Key"
          });
        }
      }
    );

    // Disable a Module
    this.expressApp.put(
      "/api/admin/app/:id/modules/:moduleId/disable",
      (req, res) => {
        const id = req.params.id;
        const moduleId = req.params.moduleId;
        const app = this.appService.getApp(id);
        if (app) {
          const module = app.getModule(moduleId);
          if (module) {
            module.disable();
            res.status(200).json({
              code: 200,
              type: "app_disabled",
              message: `Disabled Module ${module.getName()} in App ${app.getName()} successfully`
            });
          } else {
            res.status(404).json({
              code: 404,
              type: "unknown_module_error",
              message: "Cannot find Module with the provided UUID or Key"
            });
          }
        } else {
          res.status(404).json({
            code: 404,
            type: "unknown_app_error",
            message: "Cannot find App with the provided UUID or Key"
          });
        }
      }
    );
  }

  /**
   * @description initialize and start web server
   */
  start() {
    "use strict";

    // Notify listeners that we are starting
    this.eventService.emit(WEBSERVICE_STARTING_EVENT, {
      msg: "Webservice Starting",
      port: WEBSERVICE_PORT
    });
    if (!this.isRunning()) {
      this.server = require("http").createServer(this.getExpressApp());
      this.server.listen(WEBSERVICE_PORT, () => {
        this.running = true;
        // Notify listeners that we have started
        this.eventService.emit(WEBSERVICE_STARTED_EVENT, {
          msg: "Webservice Started",
          port: WEBSERVICE_PORT
        });
      });
    }
  }

  /**
   * @description Gracefully shutdown web server
   */
  shutdown() {
    "use strict";
    // Notify listeners that we are shutting down
    this.eventService.emit(WEBSERVICE_SHUTTING_DOWN_EVENT, {
      msg: "Webservice Shutting down"
    });
    this.server.close(() => {
      this.running = false;
      // Notify listeners that we have stopped
      this.eventService.emit(WEBSERVICE_SHUTDOWN_EVENT, {
        msg: "Webservice Shut down"
      });
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
   * @description Helper to get the configured Express App
   * @returns {Object} Express App
   */
  getExpressApp() {
    "use strict";
    return this.expressApp;
  }

  /**
   * @description Helper to get the passed in AppService
   * @returns {AppService} the AppService
   */
  getAppService() {
    "use strict";
    return this.appService;
  }

  /**
   * @description Helper to get the passed in EventService
   * @returns {EventService} the EventService
   */
  getEventService() {
    "use strict";
    return this.eventService;
  }
}

module.exports = DefaultWebService;
