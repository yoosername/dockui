const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

var proxyquire = require("proxyquire");
var readFileSyncStub;
var ConfigYAMLLoader;
var ConfigFileLoader;
const { Config } = require("./Config");
const CONFIG_PATH = "/path/to/config.yml";
const CONFIG_STORE = "file:./store.db";
const CONFIG_EVENTS = "memory";
const CONFIG_PORT = "2345";
const CONFIG_SECRET = "not.a.good.secret";
const CONFIG_RESOURCE_INPUT_YAML = `
# Example DockUI instance config
---
store: "${CONFIG_STORE}"
events: "${CONFIG_EVENTS}"
port: "${CONFIG_PORT}"
secret: "${CONFIG_SECRET}"
`;

describe("ConfigYAMLLoader", function() {
  "use strict";

  before(function() {
    readFileSyncStub = sinon
      .stub()
      .withArgs(CONFIG_PATH, { encoding: "utf8" })
      .returns(CONFIG_RESOURCE_INPUT_YAML);
    ConfigFileLoader = proxyquire("./ConfigFileLoader", {
      fs: { readFileSync: readFileSyncStub }
    });
    ConfigYAMLLoader = proxyquire("./ConfigYAMLLoader", {
      "./ConfigFileLoader": ConfigFileLoader
    });
  });

  it("should be defined and loadable", function() {
    expect(ConfigYAMLLoader).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(ConfigYAMLLoader).to.be.a("function");
  });

  it("should be able to parse a YAML based config file", function() {
    const configYAMLLoader = new ConfigYAMLLoader(CONFIG_PATH);
    expect(configYAMLLoader.load).to.be.a("function");
    const config = configYAMLLoader.load();
    expect(config).to.be.an.instanceOf(Config);

    expect(config.store).to.equal(CONFIG_STORE);
    expect(config.events).to.equal(CONFIG_EVENTS);
    expect(config.port).to.equal(CONFIG_PORT);
    expect(config.secret).to.equal(CONFIG_SECRET);
  });

  it("should throw and log error if cant load config file", function() {
    readFileSyncStub = sinon.stub().throws();
    ConfigFileLoader = proxyquire("./ConfigFileLoader", {
      fs: { readFileSync: readFileSyncStub }
    });
    ConfigYAMLLoader = proxyquire("./ConfigYAMLLoader", {
      "./ConfigFileLoader": ConfigFileLoader
    });
    expect(() => {
      new ConfigYAMLLoader("doesntexist").load();
    }).to.throw();
  });

  it("should throw and log error if config doesnt contain YAML", function() {
    readFileSyncStub = sinon
      .stub()
      .withArgs(CONFIG_PATH, { encoding: "utf8" })
      .returns("This is just a text file");
    ConfigFileLoader = proxyquire("./ConfigFileLoader", {
      fs: { readFileSync: readFileSyncStub }
    });
    ConfigYAMLLoader = proxyquire("./ConfigYAMLLoader", {
      "./ConfigFileLoader": ConfigFileLoader
    });
    expect(() => {
      new ConfigYAMLLoader(CONFIG_PATH).load();
    }).to.throw();
  });
});
