const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./admin/swagger.json");
let bodyParser = require("body-parser");

const swaggerOptions = {
  explorer: true
};

// >>> Setup Routes

app.use(
  "/api/admin/doc",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/json" }));

app.get("/api/admin/app", (req, res) => {
  // TODO: Actually link this up to the AppService method
  res.json([{ bla: "di" }, { bla: "doh" }]);
});

// <<< End Routes Setup

const WEBSERVICE_PORT = 3000;

const {
  WEBSERVICE_STARTING_EVENT,
  WEBSERVICE_STARTED_EVENT,
  WEBSERVICE_SHUTTING_DOWN_EVENT,
  WEBSERVICE_SHUTDOWN_EVENT
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
    this.expressApp = app;
    this.appService = appService;
    this.eventService = eventService;
  }

  /**
   * @description initialize and start web server
   */
  start() {
    "use strict";

    // Notify listeners that we are starting
    this.eventService.emit(WEBSERVICE_STARTING_EVENT, this);
    if (!this.isRunning()) {
      this.server = require("http").createServer(app);
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
