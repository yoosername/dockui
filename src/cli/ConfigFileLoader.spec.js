const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

var proxyquire = require("proxyquire");
var readFileSyncStub;
var ConfigFileLoader;
const CONFIG_PATH = "/path/to/config.js";
const CONFIG_RESOURCE = "Contents of a file";

describe("ConfigFileLoader", function() {
  "use strict";

  before(function() {
    readFileSyncStub = sinon
      .stub()
      .withArgs(CONFIG_PATH, { encoding: "utf8" })
      .returns(CONFIG_RESOURCE);
    ConfigFileLoader = proxyquire("./ConfigFileLoader", {
      fs: { readFileSync: readFileSyncStub }
    });
  });

  it("should be defined and loadable", function() {
    expect(ConfigFileLoader).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(ConfigFileLoader).to.be.a("function");
  });

  it("should log a warning if you dont extend the default behaviour of load function", function() {
    var logSpy = sinon.stub(console, "warn");
    const configFileLoader = new ConfigFileLoader(CONFIG_PATH);
    expect(configFileLoader.load).to.be.a("function");
    configFileLoader.load();
    expect(logSpy).to.be.called.callCount(1);
    logSpy.restore();
  });

  it("should return the contents of the loaded resource upon load", function() {
    var logSpy = sinon.stub(console, "warn");
    const configFileLoader = new ConfigFileLoader(CONFIG_PATH);
    expect(configFileLoader.resource).to.equal(CONFIG_RESOURCE);
    logSpy.restore();
  });
});
