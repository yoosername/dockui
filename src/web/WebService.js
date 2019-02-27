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
} = require("../constants/events");

const { validateShapes } = require("../util/validate");

/**
 * @description Wraps the intialization, configuration and starting/stopping of a web server
 *              and associated routes etc.
 */
class WebService {
  /**
   * @argument {AppService} appService The AppService for interacting with Apps
   * @argument {EventService} eventService The EventService to use for web events
   */
  constructor(appService, eventService) {
    this.running = false;

    validateShapes([
      { shape: "AppService", object: appService },
      { shape: "EventService", object: eventService }
    ]);

    this.server = null;
    this.expressApp = express();
    this.appService = appService;
    this.eventService = eventService;

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
  }

  /**
   * @description initialize and start web server
   */
  start() {
    "use strict";

    // Notify listeners that we are starting
    this.eventService.emit(WEBSERVICE_STARTING_EVENT, this);
    if (!this.isRunning()) {
      this.server = require("http").createServer(this.getExpressApp());
      this.server.listen(WEBSERVICE_PORT, () => {
        this.running = true;
        // Notify listeners that we have started
        this.eventService.emit(WEBSERVICE_STARTED_EVENT, this);
      });
    }
  }

  /**
   * @description Gracefully shutdown web server
   */
  shutdown() {
    "use strict";
    // Notify listeners that we are shutting down
    this.eventService.emit(WEBSERVICE_SHUTTING_DOWN_EVENT);
    this.server.close(() => {
      this.running = false;
      // Notify listeners that we have stopped
      this.eventService.emit(WEBSERVICE_SHUTDOWN_EVENT);
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

module.exports = WebService;
