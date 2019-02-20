const AppLoader = require("../AppLoader");
const axios = require("axios");

const { URL_APP_LOAD_REQUEST } = require("../../../constants/events");

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
  constructor(appStore, appModuleLoaders, eventService) {
    super(appStore, appModuleLoaders, eventService);

    this.client = axios.create({
      timeout: 1000
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
    // The first time we run do a one off scan for all running containers
    if (!this.scanning && this.client) {
      // First things first mark us as scanning
      this.scanning = true;

      // now listen for any events we care about.
      this.eventsService.on(URL_APP_LOAD_REQUEST, async request => {
        const url = request.url;
        await this._client(options).then(this.transformResponse);
      });
    }
    // to add App to cache use this.addApp(app);
    // to remove App from cache use this.removeApp(app);
  }

  /**
   * @description Stop checking for new Apps until scan is called again.
   */
  stopScanningForNewApps() {}
}

module.exports = UrlAppLoader;
