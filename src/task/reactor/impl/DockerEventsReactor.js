const Reactor = require("../Reactor");
const monitor = require("node-docker-monitor");
const request = require("request-promise-native");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");
const App = require("../../../app/App");
const {
  getDescriptorAsObject,
  getHashFromAppDescriptor
} = require("../../../util");

const SELECTOR_LABEL_CONFIG_KEY = "docker.selector.label";
const DEFAULT_SELECTOR_LABEL = "DOCKUI_APP";
const DEFAULT_DESCRIPTOR_NAME = "dockui.app.yml";
const DOCKUI_NETWORK_CONFIG_KEY = "network.name";
const DEFAULT_DOCKUI_NETWORK = "dockui";
const DOCKER_DESCRIPTOR_OVERRIDE_KEY = "DOCKUI_DESCRIPTOR";

const getDescriptorURLFromContainer = ({ container, config, network }) => {
  const networkContainers = network.Containers;
  let host;
  if (networkContainers.hasOwnProperty(container.Id)) {
    const iPv4Address = networkContainers[container.Id].IPv4Address;
    host = iPv4Address.split("/")[0];
  } else {
    host = "127.0.0.1";
  }
  const privatePort = container["Ports"][0]["PrivatePort"];
  const descriptorNameLabelOverride =
    container.Labels[DOCKER_DESCRIPTOR_OVERRIDE_KEY];
  const descriptorNameConfigOverride = config.get(
    DOCKER_DESCRIPTOR_OVERRIDE_KEY
  );
  const descriptorName = descriptorNameLabelOverride
    ? descriptorNameLabelOverride
    : descriptorNameConfigOverride
    ? descriptorNameConfigOverride
    : DEFAULT_DESCRIPTOR_NAME;
  return `http://${host}:${privatePort}/${descriptorName}`;
};

const defaultFetcher = async options => {
  let data = {};
  try {
    data = await request(options);
  } catch (e) {
    throw new Error(
      `Error fetching Descriptor with options(${options}) Error: ${e}`
    );
  }
  return data;
};

const fetchDescriptor = async ({ url, logger }) => {
  let options = { method: "GET", uri: url, type: "json" };
  let descriptor = null;
  try {
    descriptor = await defaultFetcher(options);
  } catch (err) {
    logger.error("error fetching descriptor from (%s), error= %o", url, err);
  }
  return descriptor;
};

/**
 * @description DockerEventsReactor listens to Docker events using a local
 *              Docker Socket and queues App Load requests upon detection
 */
class DockerEventsReactor extends Reactor {
  constructor({
    appService,
    store,
    config = new Config(),
    logger = new Logger(config)
  }) {
    super(...arguments);
    this.appService = appService;
    this.store = store;
    this.config = config;
    this.logger = logger.child({
      config: { "service.name": "DockerEventsReactor" }
    });
    this.containerSelectorLabel = config.get(SELECTOR_LABEL_CONFIG_KEY)
      ? config.get(SELECTOR_LABEL_CONFIG_KEY)
      : DEFAULT_SELECTOR_LABEL;
    this._running = false;
    this._cachedContainers = [];
  }

  /**
   * @description Return true if this Reactor is currently running
   */
  isRunning() {
    return this._running;
  }

  /**
   * @description Return the Docker network in use
   */
  async onContainerUp(container) {
    const containerId = container.Id;
    // If the containerId is known, then simply reload the App
    const cachedApp = this._cachedContainers[containerId];
    console.log(container.Id, cachedApp);
    if (cachedApp) {
      // Container has been seen before - submit a reload
      this.logger.info(
        "Docker container with id(%s) seen before, descriptor valid, App Exists(key=%s), triggering RELOAD",
        container.Id,
        cachedApp.getKey()
      );
      return this.appService.reloadApp(cachedApp);
    }
    // Otherwise try to fetch the descriptor
    try {
      // Check if the container is using bridged mode or a custom network
      //  - If Bridged use gateway and host port, if overlay then use service name and private port
      const netInfo = await this.inspectNetworkInfo();
      const url = getDescriptorURLFromContainer({
        container,
        config: this.config,
        network: netInfo
      });
      // Fetch descriptor
      let descriptor = await fetchDescriptor({ url, logger: this.logger });
      // If YAML Turn into Object
      descriptor = getDescriptorAsObject(descriptor);
      // If there is a descriptor
      if (descriptor) {
        // Get the ID
        const descriptorId = getHashFromAppDescriptor(descriptor);
        // Try to load from Store (perhaps was loaded via another mechanism)
        const existingAppData = this.store.read(descriptorId);
        let app;
        if (existingAppData) {
          // If exists then must have been loaded another way - try reload
          app = new App(existingAppData);
          // Submit a reload
          this.logger.info(
            "Docker container with id(%s) not seen before, yet App(key=%s) Exists, triggering RELOAD",
            container.Id,
            app.getKey()
          );
          this.appService.reloadApp(app);
        } else {
          // Container has not been seen before. App isnt already Loaded - submit Load
          app = new App(descriptor);
          this.logger.info(
            "Docker container with id(%s) not seen before, App(key=%s) Doesnt exist, descriptor valid, triggering LOAD",
            container.Id,
            app.getKey()
          );
          // Load App with DEFAULT permissions
          this.appService.loadApp(url, App.permissions.DEFAULT);
        }
        // Add to the cache
        this._cachedContainers[containerId] = app;
      } else {
        this.logger.warn(
          "Docker container detected with %s Label but could not detect a descriptor at %s - Skipping",
          DEFAULT_SELECTOR_LABEL,
          url
        );
      }
    } catch (err) {
      this.logger.warn(
        "Error fetching descriptor from detected Docker container, error = %o",
        err
      );
    }
  }

  /**
   * @description Return the Docker network in use
   */
  async onContainerDown(container) {
    const containerId = container.Id;
    const existingApp = this._cachedContainers[containerId];
    // Get descriptor from cache if any
    if (existingApp) {
      // Container has been seen before
      // Check the app associated to it is still loaded
      try {
        const existingAppData = this.store.read(existingApp.getId());
        // And if it is unload it
        if (existingAppData) {
          this.logger.info(
            "Docker container shutdown detected - UNLOADING associated App with key=%s",
            existingAppData.key
          );
          this.appService.unloadApp(new App(existingAppData));
        }
      } catch (err) {
        this.logger.error("Problem attempting to unload App: error = %o", err);
      }
      // Finally - Remove from cache either way
      delete this._cachedContainers[containerId];
    } else {
      this.logger.info(
        "Docker container shutdown detected - No associated App detected - Skipping"
      );
    }
  }

  /**
   * @description Inspect current Docker Network for DockUI and return it
   */
  async inspectNetworkInfo() {
    if (this.isRunning() && this.monitor && this.monitor.docker) {
      let conf = this.config.get(DOCKUI_NETWORK_CONFIG_KEY);
      let dockuiNet, dockuiNetInspect;
      try {
        conf = conf ? conf : DEFAULT_DOCKUI_NETWORK;
        dockuiNet = this.monitor.docker.getNetwork(conf);
        dockuiNetInspect = await dockuiNet.inspect();
      } catch (err) {
        this.logger.error(
          "Problem inspecting Docker Network(%s), error = %o",
          conf,
          err
        );
      }
      return dockuiNetInspect;
    }
  }

  /**
   * @description initialize and start Reactor
   */
  start() {
    "use strict";
    if (this.isRunning()) {
      return Promise.resolve();
    }
    return new Promise(async (resolve, reject) => {
      try {
        this.monitor = monitor(
          {
            onContainerUp: this.onContainerUp.bind(this),
            onContainerDown: this.onContainerDown.bind(this)
          },
          {
            socketPath: "/var/run/docker.sock"
          },
          {
            strategy: "monitorSelected",
            selectorLabel: this.containerSelectorLabel
          }
        );
        this._running = true;
        this.logger.debug(
          "Reactor is listening for Docker events(start/stop) for containers labelled with(%s)",
          this.containerSelectorLabel
        );
        resolve();
      } catch (err) {
        this.logger.error("Reactor failed to start %o", err);
        reject();
      }
    });
  }

  /**
   * @description Gracefully shutdown Reactor
   */
  shutdown() {
    "use strict";
    if (!this.isRunning()) {
      return Promise.resolve();
    }
    return new Promise(async (resolve, reject) => {
      // Do we need to actively close the monitor??
      try {
        this.monitor.stop();
        this.monitor = null;
      } catch (err) {
        this.logger.error("Reactor error while stopping %o", err);
      }
      this._running = false;
      resolve();
    });
  }
}

module.exports = DockerEventsReactor;
