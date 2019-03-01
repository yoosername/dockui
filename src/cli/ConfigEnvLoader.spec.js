const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

var ConfigEnvLoader;
var configEnvLoader;

const ConfigDefaults = require("./ConfigDefaults");

describe("ConfigEnvLoader", function() {
  "use strict";

  before(function() {
    ConfigEnvLoader = require("./ConfigEnvLoader");
    configEnvLoader = new ConfigEnvLoader();
  });

  it("should be defined and loadable", function() {
    expect(ConfigEnvLoader).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(ConfigEnvLoader).to.be.a("function");
  });

  // store
  it("should be able to set the store", function() {
    let config = configEnvLoader.load();
    expect(config.store).to.equal(ConfigDefaults.STORE);
    process.env.DOCKUI_STORE = "redis:server.net:1234";
    config = configEnvLoader.load();
    expect(config.store).to.equal("redis:server.net:1234");
    delete process.env.DOCKUI_STORE;
  });

  // events
  it("should be able to set the events", function() {
    let config = configEnvLoader.load();
    expect(config.events).to.equal(ConfigDefaults.EVENTS);
    process.env.DOCKUI_EVENTS = "rabbitmq::9200/bla";
    config = configEnvLoader.load();
    expect(config.events).to.equal("rabbitmq::9200/bla");
    delete process.env.DOCKUI_EVENTS;
  });

  // port
  it("should be able to set the port", function() {
    let config = configEnvLoader.load();
    expect(config.port).to.equal(ConfigDefaults.PORT);
    process.env.DOCKUI_PORT = "9000";
    config = configEnvLoader.load();
    expect(config.port).to.equal("9000");
    delete process.env.DOCKUI_PORT;
  });

  // secret
  it("should be able to set the global secret", function() {
    let config = configEnvLoader.load();
    expect(config.secret).to.equal(ConfigDefaults.SECRET);
    process.env.DOCKUI_SECRET = "changeme";
    config = configEnvLoader.load();
    expect(config.secret).to.equal("changeme");
    delete process.env.DOCKUI_SECRET;
  });
});
