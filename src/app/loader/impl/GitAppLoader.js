const AppLoader = require("../AppLoader");
var NodeGit = require("nodegit");

const {
  GIT_APP_LOAD_REQUEST,
  GIT_APP_LOAD_STARTED,
  GIT_APP_LOAD_COMPLETE,
  GIT_APP_LOAD_FAILED,
  URL_APP_LOAD_REQUEST
} = require("../../../constants/events");

const REPO_CACHE = require("path").join(__dirname, "repo_cache");

/**
 * @description An AppLoader which detects GIT_REPO_REQUESTED events.
 *              - when detected attempt to clone the repo to a temporary cache
 *              - and send a FILE_APP_LOAD_REQUEST Event
 */
class GitAppLoader extends AppLoader {
  /**
   * @argument {AppStore} appStore - The store to use for persistence.
   * @argument {Array} AppModuleLoaders - The loaders to use for loading Modules.
   * @argument {EventService} eventService - The Event service.
   */
  constructor(appStore, appModuleLoaders, eventService) {
    super(appStore, appModuleLoaders, eventService);
    this.listeners = [];
    this.scanning = false;
  }

  /**
   * @description Setup our required EventListeners
   */
  addEventListeners() {
    //  Start listening for events from the framework
    //  - GIT_APP_LOAD_REQUEST means user requested an App load from a git repo
    this.listeners.push({
      eventName: GIT_APP_LOAD_REQUEST,
      listener: async request => {
        const cloneUrl = request.repo;

        // Tell the system we has started processing a new Container
        this.eventsService.emit(GIT_APP_LOAD_STARTED, {
          status: "loading",
          message:
            "A Git Repo (" + cloneUrl + ") was requested and will be fetched",
          repo: cloneUrl
        });

        const localClonePath = REPO_CACHE;
        const cloneOptions = {
          fetchOpts: {
            callbacks: {
              certificateCheck: function() {
                return 1;
              }
            }
          }
        };

        await NodeGit.Clone(cloneUrl, localClonePath, cloneOptions)
          .catch(() => {
            return NodeGit.Repository.open(localClonePath);
          })
          .catch(err => {
            this.eventsService.emit(GIT_APP_LOAD_FAILED, { error: err });
          })
          .then(repository => {
            // Access any repository methods here.
            console.log(
              "Git Repository was loaded from %s to %s",
              repository,
              localClonePath
            );
            this.eventsService.emit(GIT_APP_LOAD_COMPLETE, repository);
          });
      }
    });

    this.listeners.forEach(event => {
      "use strict";
      this.eventsService.addListener(event.eventName, event.listener);
    });
  }

  /**
   * @description Remove all added EventListeners
   */
  removeEventListeners() {
    this.listeners.forEach(event => {
      "use strict";
      this.eventsService.removeListener(event.eventName, event.listener);
    });
  }

  /**
   * @description Detect GIT_REPO_REQUESTED events.
   *              - when detected attempt to clone the repo to a temporary cache
   *              - and send a FILE_APP_LOAD_REQUEST Event
   */
  scanForNewApps() {
    // Only do this once
    if (!this.scanning) {
      // First things first mark us as scanning
      this.scanning = true;

      // Attach required events
      this.addEventListeners();
    }
  }

  /**
   * @description Stop listening for GIT_REPO_REQUESTED events
   */
  stopScanningForNewApps() {
    // Remove existing handlers
    this.removeEventListeners();

    // Mark ourselves as not scanning
    this.scanning = false;
  }
}

module.exports = GitAppLoader;
