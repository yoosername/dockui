const Reactor = require("../Reactor");
const monitor = require("node-docker-monitor");
const request = require("request-promise-native");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");

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
  let options = { method: "GET", uri: url };
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
    taskManager,
    config = new Config(),
    logger = new Logger(config)
  }) {
    super(...arguments);
    this.taskManager = taskManager;
    this.config = config;
    this.logger = logger.child({
      config: { "service.name": "DockerEventsReactor" }
    });
    this.containerSelectorLabel = config.get(SELECTOR_LABEL_CONFIG_KEY)
      ? config.get(SELECTOR_LABEL_CONFIG_KEY)
      : DEFAULT_SELECTOR_LABEL;
    this._running = false;
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
    // Check if the container is using bridged mode or a custom network
    // {
    //   Id: '0e2286853a696a2ef81b69a2cb9d500f49f0c118d9f9df90c6047db62013c512',
    //   Names: [ '/sad_elbakyan' ],
    //   Image: 'alpine',
    //   ImageID: 'sha256:caf27325b298a6730837023a8a342699c8b7b388b8d878966b064a1320043019',
    //   Command: '/bin/sh',
    //   Created: 1562593356,
    //   Ports: [],
    //   Labels: { DOCKUI_APP: 'true' },
    //   State: 'running',
    //   Status: 'Up Less than a second',
    //   HostConfig: { NetworkMode: 'default' },
    //   NetworkSettings: { Networks: { bridge: [Object] } },
    //   Mounts: [],
    //   Name: 'sad_elbakyan'
    // }
    // Then check it serves a descriptor at the expected location.
    // If so then add a task to TaskManager to load it
    // If Bridged use gateway and host port, if overlay then use service name and private port
    const netInfo = await this.inspectNetworkInfo();
    const url = getDescriptorURLFromContainer({
      container,
      config: this.config,
      network: netInfo
    });
    try {
      const descriptor = await fetchDescriptor({ url, logger: this.logger });
      if (descriptor) {
        this.logger.info(
          "Docker container detected with id %s and descriptor detected at %s - Submitting Load event",
          container.Id,
          url
        );
      } else {
        this.logger.warn(
          "Docker container detected with %s Label but could not detect a descriptor at %s - Skipping",
          DEFAULT_SELECTOR_LABEL,
          url
        );
      }
      // Hash the descriptor to get ID
      // Check if exists.
      // If it does use TaskManager to fire off a Reload task
      // If it doesnt then use TaskManager to fire off a Load event
      // Make sure its read only.
    } catch (err) {}
  }

  /**
   * @description Return the Docker network in use
   */
  onContainerDown(container) {
    this.logger.info(
      "Docker container shutdown detected with id %s - Submitting unload event",
      container.Id
    );
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
