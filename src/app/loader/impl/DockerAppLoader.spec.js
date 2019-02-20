const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const EventEmitter = require("events");

const {
  MockAppStore,
  MockModuleLoaders,
  MockEventService
} = require("../../../util/mocks");

const {
  DOCKER_APP_LOAD_REQUEST,
  DOCKER_APP_LOAD_STARTED,
  DOCKER_APP_LOAD_COMPLETE,
  DOCKER_APP_LOAD_FAILED,
  DOCKER_CONTAINER_DETECTED,
  URL_APP_LOAD_REQUEST
} = require("../../../constants/events");

const generateHex = length => {
  "use strict";

  var ret = "";
  while (ret.length < length) {
    ret += Math.random()
      .toString(16)
      .substring(2);
  }
  return ret.substring(0, length);
};

const generateDate = () => {
  "use strict";

  var ret = "";
  while (ret.length < 10) {
    ret += Math.random()
      .toString(10)
      .substring(2);
  }
  return parseInt(ret.substring(0, 10));
};

const generatePortBetween = (start, end) => {
  "use strict";
  return Math.floor(Math.random() * end) + start;
};

const generateMacAddress = () => {
  "use strict";
  return "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
    return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
  });
};

const generateContainer = () => {
  "use strict";
  return {
    Id: `'${generateHex(64)}'`,
    Names: ["/weary_lionel", "suprised_morty"],
    Image: "alpine",
    ImageID: `'sha256:${generateHex(64)}'`,
    Command: "top",
    Created: generateDate(),
    Ports: [
      {
        IP: "0.0.0.0",
        PrivatePort: 80,
        PublicPort: generatePortBetween(30000, 32000),
        Type: "tcp"
      }
    ],
    Labels: {},
    State: "running",
    Status: "Up 33 seconds",
    HostConfig: { NetworkMode: "default" },
    NetworkSettings: {
      Networks: {
        bridge: {
          IPAMConfig: null,
          Links: null,
          Aliases: null,
          NetworkID: `'${generateHex(64)}'`,
          EndpointID: `'${generateHex(64)}'`,
          Gateway: "172.17.0.1",
          IPAddress: "172.17.0.2",
          IPPrefixLen: 16,
          IPv6Gateway: "",
          GlobalIPv6Address: "",
          GlobalIPv6PrefixLen: 0,
          MacAddress: `'${generateMacAddress()}'`,
          DriverOpts: null
        }
      }
    },
    Mounts: []
  };
};

const generateContainers = num => {
  "use strict";

  var list = [];
  for (var n = 0; n < num; n++) {
    list.push(generateContainer());
  }
  return list;
};

const SingleRequestDockerAppLoader = (image, container) => {
  "use strict";
  const dockerEvents = new EventEmitter();
  container.Image = image;
  const customDockerodeStub = sinon.stub().returns({
    listContainers: fn => {
      fn(null, []);
    },
    run: (img, cmd, stream, fn) => {
      dockerEvents.emit("start", container);
      fn(null, null, container);
    },
    getEvents: fn => {
      fn(null, dockerEvents);
    }
  });
  DockerAppLoader = proxyquire("./DockerAppLoader", {
    dockerode: customDockerodeStub,
    fs: { statSync: () => true }
  });
  return { DockerAppLoader, dockerEvents };
};

const SingleRequestFailedDockerAppLoader = (image, container) => {
  "use strict";
  const dockerEvents = new EventEmitter();
  container.Image = image;
  const customDockerodeStub = sinon.stub().returns({
    listContainers: fn => {
      fn(null, []);
    },
    run: (img, cmd, stream, fn) => {
      fn(new Error());
    },
    getEvents: fn => {
      fn(null, dockerEvents);
    }
  });
  DockerAppLoader = proxyquire("./DockerAppLoader", {
    dockerode: customDockerodeStub,
    fs: { statSync: () => true }
  });
  return { DockerAppLoader, dockerEvents };
};

var proxyquire = require("proxyquire");
var dockerode0ContainersAtStartStub;
var dockerode5ContainersAtStartStub;
var DockerAppLoader;
var DockerAppLoaderWith5StartedContainers;
var docker0EventEmitter;
var docker5EventEmitter;

var mockAppStore = null;
var mockModuleLoaders = null;
var mockEventService = null;

describe("DockerAppLoader", function() {
  "use strict";

  beforeEach(function() {
    docker0EventEmitter = new EventEmitter();
    docker5EventEmitter = new EventEmitter();
    mockAppStore = new MockAppStore();
    mockModuleLoaders = new MockModuleLoaders();
    mockEventService = new MockEventService();
    dockerode0ContainersAtStartStub = sinon.stub().returns({
      listContainers: fn => {
        fn(null, []);
      },
      getEvents: fn => {
        fn(null, docker0EventEmitter);
      }
    });
    dockerode5ContainersAtStartStub = sinon.stub().returns({
      listContainers: fn => {
        fn(null, generateContainers(5));
      },
      getEvents: fn => {
        fn(null, docker5EventEmitter);
      }
    });
    DockerAppLoader = proxyquire("./DockerAppLoader", {
      dockerode: dockerode0ContainersAtStartStub,
      fs: { statSync: () => true }
    });
    DockerAppLoaderWith5StartedContainers = proxyquire("./DockerAppLoader", {
      dockerode: dockerode5ContainersAtStartStub,
      fs: { statSync: () => true }
    });
  });

  it("should be defined and loadable", function() {
    expect(DockerAppLoader).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(DockerAppLoader).to.be.a("function");
  });

  it("should initially detect all running containers when scanForNewApps is run", function(done) {
    const eventService = new EventEmitter();
    var count = 0;
    eventService.on(DOCKER_CONTAINER_DETECTED, () => {
      count++;
      if (count === 5) {
        done();
      }
    });
    const dockerAppLoader = new DockerAppLoaderWith5StartedContainers(
      mockAppStore,
      mockModuleLoaders,
      eventService
    );
    dockerAppLoader.isDockerRunning = () => true;
    dockerAppLoader.scanForNewApps();
  });

  it("should attempt to start container when DOCKER_APP_LOAD_REQUEST detected", function(done) {
    const frameworkEvents = new EventEmitter();
    const container = generateContainer();
    const image = "dockui/unittest";
    const { DockerAppLoader, dockerEvents } = SingleRequestDockerAppLoader(
      image,
      container
    );
    dockerEvents.on("start", container => {
      expect(container.Image).to.equal(image);
      done();
    });
    const dockerAppLoader = new DockerAppLoader(
      mockAppStore,
      mockModuleLoaders,
      frameworkEvents
    );
    dockerAppLoader.scanForNewApps();
    frameworkEvents.emit(DOCKER_APP_LOAD_REQUEST, { image: image });
  });

  it("should emit DOCKER_APP_LOAD_STARTED when container detected before processing", function(done) {
    const frameworkEvents = new EventEmitter();
    const container = generateContainer();
    const image = "dockui/unittest";
    const { DockerAppLoader } = SingleRequestDockerAppLoader(image, container);
    frameworkEvents.on(DOCKER_APP_LOAD_STARTED, payload => {
      expect(payload.image).to.equal(image);
      done();
    });
    const dockerAppLoader = new DockerAppLoader(
      mockAppStore,
      mockModuleLoaders,
      frameworkEvents
    );
    dockerAppLoader.scanForNewApps();
    frameworkEvents.emit(DOCKER_APP_LOAD_REQUEST, { image: image });
  });

  it("should emit DOCKER_APP_LOAD_COMPLETE when everything is complete", function(done) {
    const frameworkEvents = new EventEmitter();
    const container = generateContainer();
    const image = "dockui/unittest";
    const { DockerAppLoader } = SingleRequestDockerAppLoader(image, container);
    frameworkEvents.on(DOCKER_APP_LOAD_COMPLETE, payload => {
      expect(payload.Image).to.equal(image);
      done();
    });
    const dockerAppLoader = new DockerAppLoader(
      mockAppStore,
      mockModuleLoaders,
      frameworkEvents
    );
    dockerAppLoader.scanForNewApps();
    frameworkEvents.emit(DOCKER_APP_LOAD_REQUEST, { image: image });
  });

  it("should emit DOCKER_APP_LOAD_FAILED if a container cant be started", function(done) {
    const frameworkEvents = new EventEmitter();
    const container = generateContainer();
    container.Ports = null;
    const image = "dockui/unittest";
    const { DockerAppLoader } = SingleRequestFailedDockerAppLoader(
      image,
      container
    );
    frameworkEvents.on(DOCKER_APP_LOAD_FAILED, () => {
      done();
    });
    const dockerAppLoader = new DockerAppLoader(
      mockAppStore,
      mockModuleLoaders,
      frameworkEvents
    );
    dockerAppLoader.scanForNewApps();
    frameworkEvents.emit(DOCKER_APP_LOAD_REQUEST, { image: image });
  });

  it("should emit URL_APP_LOAD_REQUEST if Container has reachable URL", function(done) {
    const frameworkEvents = new EventEmitter();
    const container = generateContainer();
    const image = "dockui/unittest";
    const { DockerAppLoader, dockerEvents } = SingleRequestDockerAppLoader(
      image,
      container
    );
    frameworkEvents.on(URL_APP_LOAD_REQUEST, () => {
      done();
    });
    const dockerAppLoader = new DockerAppLoader(
      mockAppStore,
      mockModuleLoaders,
      frameworkEvents
    );
    dockerAppLoader.scanForNewApps();
    dockerEvents.emit("start", container);
  });

  it("should keep detecting new containers individually until stopScanningForNewApps", function() {
    const frameworkEvents = new EventEmitter();
    const container = generateContainer();
    const image = "dockui/unittest";
    const { DockerAppLoader, dockerEvents } = SingleRequestDockerAppLoader(
      image,
      container
    );
    const dockerAppLoader = new DockerAppLoader(
      mockAppStore,
      mockModuleLoaders,
      frameworkEvents
    );
    const spy = sinon.spy(dockerAppLoader, "getOrSetCachedContainer");
    dockerAppLoader.scanForNewApps();
    expect(spy.callCount).to.equal(0);
    dockerEvents.emit("start", generateContainer());
    dockerEvents.emit("start", generateContainer());
    dockerEvents.emit("start", generateContainer());
    expect(spy.callCount).to.equal(3);
    dockerAppLoader.stopScanningForNewApps();
    dockerEvents.emit("start", generateContainer());
    dockerEvents.emit("start", generateContainer());
    expect(spy.callCount).to.equal(3);
  });
});
