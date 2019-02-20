const AppLoader = require("../AppLoader");
const axios = require("axios");
const yaml = require("js-yaml");

const {
  URL_APP_LOAD_REQUEST,
  URL_APP_LOAD_STARTED,
  URL_APP_LOAD_FAILED,
  URL_APP_LOAD_COMPLETE
} = require("../../../constants/events");

const AppDescriptor = require("../../descriptor/AppDescriptor");
const App = require("../../App");

/**
 * @description An AppLoader which detects URL_APP_LOAD_REQUESTED events.
 *              - when detected attempt to load descriptor from the URL
 *              - download the descriptor to a local file cache
 *              - Send FILE_APP_LOAD_REQUEST Event
 */
class UrlAppLoader extends AppLoader {
  /**
   * @argument {AppStore} appStore - The store to use for persistence.
   * @argument {Array} AppModuleLoaders - The loaders to use for loading Modules.
   * @argument {EventService} eventService - The Event service.
   */
  constructor(appStore, moduleLoaders, eventService) {
    super(appStore, moduleLoaders, eventService);

    this.scanning = false;
    this.listeners = [];
    this.client = axios.create({
      timeout: 1000
    });
  }

  /**
   * @description Setup our required EventListeners
   */
  addEventListeners() {
    this.listeners.push({
      eventName: URL_APP_LOAD_REQUEST,
      listener: async request => {
        const url = request.url;
        const permission = request.permission;
        var response;

        // Tell the system we have started processing a new Request
        this.eventService.emit(URL_APP_LOAD_STARTED, {
          status: "loading",
          message: "Attempting to load an App descriptor from (" + url + ")",
          url: url
        });

        // Try to fetch descriptor from remote
        try {
          response = await this.client({
            method: "get",
            url: url
          });
        } catch (err) {
          // emit Error here
          return this.eventService.emit(URL_APP_LOAD_FAILED, {
            error: err,
            url: url
          });
        }

        if (response && response.body) {
          this.handleNewDescriptor(url, response.body, permission);
        }
      }
    });

    this.listeners.forEach(event => {
      "use strict";
      this.eventService.addListener(event.eventName, event.listener);
    });
  }

  /**
   * @description Remove all added EventListeners
   */
  removeEventListeners() {
    this.listeners.forEach(event => {
      "use strict";
      this.eventService.removeListener(event.eventName, event.listener);
    });
  }

  /**
   * @description Listen to framework events for URL_APP_LOAD_REQUESTED events.
   *              when detected:
   *              - Send APP_LOAD_STARTED Event
   *              - Attempt to load descriptor from the URL
   *              - validate the descriptor
   *                  - If fail send App load failed event
   *              - download the descriptor to a local file cache
   *              - Send URL_APP_LOAD_COMPLETE Event
   *              - Send FILE_APP_LOAD_REQUEST Event
   */
  scanForNewApps() {
    // If we are not already scanning and we have a valid client
    if (!this.scanning && this.client) {
      // First things first mark us as scanning
      this.scanning = true;

      // Attach required events
      this.addEventListeners();
    }
  }

  /**
   * @description Create an App from a Valid Descriptor and cache it
   *              If Successful emit an APP_LOAD_COMPLETE event
   *              If Error emit an APP_LOAD_FAILURE event
   * @argument {String} url The URL where we fetched this descriptor from
   * @argument {Object} rawDescriptor The Raw Descriptor
   * @argument {AppPermission} permission The AppPermission to be granted to the newly created App
   */
  handleNewDescriptor(url, rawDescriptor, permission) {
    var descriptor = rawDescriptor;
    var appDescriptor;
    var app;

    // If Descriptor is YAML change it to JSON object
    if (url.endsWith("yml") || url.endsWith("yaml")) {
      try {
        descriptor = yaml.safeLoad(descriptor);
      } catch (err) {
        return this.eventService.emit(URL_APP_LOAD_FAILED, {
          error:
            "Descriptor was detected as YAML but cannot be parsed : " + err,
          url: url
        });
      }
    }

    // Should be an object by now so fail and emit error if not
    if (!descriptor || typeof descriptor !== "object") {
      // Something messed up and we didnt get an object
      return this.eventService.emit(URL_APP_LOAD_FAILED, {
        error: "Descriptor is not valid JSON or Yaml",
        url: url
      });
    }

    // Create AppDescriptor from JSONobject
    try {
      appDescriptor = new AppDescriptor(descriptor);
    } catch (err) {
      return this.eventService.emit(URL_APP_LOAD_FAILED, {
        error:
          "Descriptor was loaded OK but is not valid App descriptor: " + err,
        url: url
      });
    }

    // If we have already loaded an App with the specified Key then end here:
    if (this.getApp(appDescriptor.getKey())) {
      return this.eventService.emit(URL_APP_LOAD_FAILED, {
        error: "Descriptor has been loaded before so skipping",
        url: url
      });
    }

    // If no Errors here then ready to create and not in cache
    try {
      app = new App(
        appDescriptor.getKey(),
        permission,
        appDescriptor,
        this,
        this.moduleLoaders,
        this.appStore,
        this.eventService
      );
    } catch (err) {
      return this.eventService.emit(URL_APP_LOAD_FAILED, {
        error:
          "Descriptor was loaded and Parsed but couldnt create App: " + err,
        url: url
      });
    }

    if (app && app instanceof App) {
      // Add App to our cache
      this.addApp(app);

      this.eventService.emit(URL_APP_LOAD_COMPLETE, {
        app: app,
        url: url,
        permission: permission
      });
    }
  }

  /**
   * @description Stop checking for new Apps until scan is called again.
   */
  stopScanningForNewApps() {
    // Remove existing handlers
    this.removeEventListeners();

    // Mark ourselves as not scanning
    this.scanning = false;
  }
}

module.exports = UrlAppLoader;
