const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
const sandbox = require("sinon").createSandbox();

const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

var configLoader1 = null;
var configLoader2 = null;
var logSpy = null;
var loggerSpy = null;
var CLI = require("./CLI");
var cli = null;

describe("CLI", function() {
  "use strict";

  beforeEach(function() {
    configLoader1 = sandbox.stub().returns({
      load: () => {
        return {
          store: "store1",
          events: "events1",
          port: "port1",
          secret: "secret1"
        };
      }
    });
    configLoader2 = sandbox.stub().returns({
      load: () => {
        return {
          store: "store2",
          port: "port2"
        };
      }
    });
    logSpy = sandbox.spy();
    loggerSpy = sandbox.stub().returns({ log: logSpy });
    cli = new CLI({
      logger: new loggerSpy(),
      configLoaders: [configLoader1(), configLoader2()]
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should be defined and loadable", function() {
    expect(CLI).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(CLI).to.be.a("function");
  });

  // TODO (v0.0.1-Alpha): These tests

  // GENERIC TESTS
  // (a) Should be configurable by a heirarchy of ConfigLoaders
  it("should be configurable by a heirarchy of ConfigLoaders", function() {
    expect(cli.getConfig).to.be.a("function");
    expect(cli.getConfig().store).to.equal("store2");
    expect(cli.getConfig().events).to.equal("events1");
    expect(cli.getConfig().port).to.equal("port2");
    expect(cli.getConfig().secret).to.equal("secret1");
  });

  // (b) Should log usage when --help is passed on command line
  it("should log usage when --help is passed as Arg", function(done) {
    cli
      .parse(["node", "dockui", "--help"])
      .then(args => {
        expect(args[0][1]).to.equal("dockui");
        expect(logSpy).to.be.called.callCount(1);
        expect(logSpy.getCall(0).args[0]).to.contain("Usage:");
        done();
      })
      .catch(console.log);
  });

  // (c) Should log usage when --help is passed when executed as main module
  it("should log usage when executed as main module", async function() {
    const file = path.join(__dirname, ".", "CLI.js");
    const { stdout, stderr } = await exec(`${file} --help`);
    expect(stderr).to.be.empty;
    expect(stdout).to.contain("Usage:");
  });

  // (d) Should log to STDOUT (with configurable verbosity)

  // COMMAND TESTS
  // Instance Commands to test
  // (1) Run an instance of the DockUI framework
  //     - This should output all required details to STDOUT like web host and port being used
  //     - Required security keys etc are accessed via the DB, which in the case of the default is a well defined persistent in memory DB
  //
  //     $ dockui run

  // (3) List state of Loaded Apps
  //
  //     $ dockui apps
  //
  // App                   UUID         State                            Permission
  // ------------------------------------------------------------------------------
  // Demo Theme App        3cd6745f     Loaded (enabled)                 READ
  // Demo ReadOnly App     6ec43a77     Loaded (Awaiting Approval)       NONE
  // Demo Dynamic App      37fe3c2c     Loaded (disabled)                ADMIN
  // Demo Dynamic App2     c6cc4af6     Loading..........                NONE

  // (4) Load an App
  //
  //     $ dockui apps load [--permission <permission> --auto-approve <instance>] <url>|<dockerImage>|<gitRepo>|<filename>

  // (5) Approve a loaded APP which is awaiting Approval:
  //
  //     $ dockui apps approve [--permission <permission>] <uuid>

  // (6) Gracefully stop the running DockUI instance
  //
  //     $ Ctrl+C or SIGTERM
  //
});
