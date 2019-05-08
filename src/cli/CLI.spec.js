const CLI = require("./CLI");
const ConfigLoader = require("./ConfigLoader");
const { DockUIApps } = require("../DockUIApps");
const { defaultConfig } = require("../Defaults");

jest.mock("./ConfigLoader");
jest.mock("../DockUIApps");

var configLoader1 = null;
var configLoader2 = null;
var logSpy,
  warnSpy,
  debugSpy = null;
var cli = null;

describe("CLI", function() {
  "use strict";

  beforeEach(function() {
    configLoader1 = new ConfigLoader();
    configLoader1.load.mockImplementation(() => {
      return {
        store: "store1",
        port: "port1",
        secret: "secret1"
      };
    });

    configLoader2 = new ConfigLoader();
    configLoader2.load.mockImplementation(() => {
      return {
        store: "store2",
        port: "port2"
      };
    });
    logSpy = jest.spyOn(console, "log").mockImplementation();
    //warnSpy = jest.spyOn(console, "warn").mockImplementation();
    //debugSpy = jest.spyOn(global.console, "debug").mockImplementation();
  });

  afterEach(function() {
    logSpy.mockRestore();
    //warnSpy.mockReset();
    //debugSpy.mockReset();
  });

  test("should be defined and loadable", function() {
    expect(CLI).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof CLI).toBe("function");
  });

  // GENERIC TESTS
  // Should be configurable by passing in a config object
  test("should be configurable by passing in a config", function() {
    cli = new CLI({ dockui: new DockUIApps() });
    expect(typeof cli.getConfig).toBe("function");
    expect(cli.getConfig().secret).toBe(defaultConfig.secret);
    cli = new CLI({
      dockui: new DockUIApps(),
      config: {
        store: "store1",
        events: "events1",
        port: "port1",
        secret: "secret1"
      }
    });
    expect(cli.getConfig().store).toBe("store1");
    expect(cli.getConfig().events).toBe("events1");
    expect(cli.getConfig().port).toBe("port1");
    expect(cli.getConfig().secret).toBe("secret1");
  });

  // Should be configurable by passing in a heirarchy of ConfigLoaders
  test("should be configurable by passing in a heirarchy of ConfigLoaders", function() {
    ConfigLoader.loadConfig = jest.fn(() => {
      return Object.assign(configLoader1.load(), configLoader2.load());
    });
    cli = new CLI({
      dockui: new DockUIApps(),
      configLoaders: [configLoader1, configLoader2]
    });
    expect(typeof cli.getConfig).toBe("function");
    expect(cli.getConfig().store).toBe("store2");
    expect(cli.getConfig().port).toBe("port2");
    expect(cli.getConfig().secret).toBe("secret1");
  });

  // Should log usage when --help is passed on command line
  test("should log usage when --help is passed as Arg", done => {
    expect(logSpy).not.toHaveBeenCalled();
    return cli
      .parse(["node", "dockui", "--help"])
      .then(() => {
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy.mock.calls[0][0]).toContain("Usage");
        done();
      })
      .catch(console.log);
  });

  // Move this E2E test out of here
  // test("should be able to run as main module with no args", async function() {
  //   const file = path.join(__dirname, ".", "CLI.js");
  //   var { stdout, stderr } = await exec(`${file} --help`);
  //   expect(stderr).to.be.empty;
  //   expect(stdout).to.contain("Usage");
  //   var { stdout, stderr } = await exec(`${file}`);
  //   expect(stderr).to.be.empty;
  //   expect(stdout).to.contain("Usage");
  // });

  // Should log to STDOUT (with configurable verbosity)
  test("should log to STDOUT (with configurable verbosity)", async function() {
    expect(logSpy).not.toHaveBeenCalled();
    await cli.parse(["node", "dockui", "--help"]);
    expect(logSpy.mock.calls[0][0]).toContain("Log Level:  info");
    await cli.parse(["node", "dockui", "--help", "-v"]);
    expect(logSpy.mock.calls[1][0]).toContain("Log Level:  info");
    await cli.parse(["node", "dockui", "--help", "-vv"]);
    expect(logSpy.mock.calls[2][0]).toContain("Log Level:  warn");
    await cli.parse(["node", "dockui", "--help", "-vvv"]);
    expect(logSpy.mock.calls[3][0]).toContain("Log Level:  error");
    await cli.parse(["node", "dockui", "--help", "-vvvv"]);
    expect(logSpy.mock.calls[4][0]).toContain("Log Level:  debug");
  });

  // COMMAND TESTS
  // Instance Commands to test
  // (1) Run an instance of the DockUI framework
  //     - This should output all required details to STDOUT like web host and port being used
  //     - Required security keys etc are accessed via the DB, which in the case of the default is a well defined persistent in memory DB
  //
  //     $ dockui run
  test("should run an instance of dockui)", async function() {
    const dockuiApps = new DockUIApps();
    expect(dockuiApps.start).not.toHaveBeenCalled();
    cli = new CLI({
      dockui: dockuiApps
    });
    await cli.parse(["node", "dockui", "run"]);
    expect(dockuiApps.start).toHaveBeenCalled();
  });

  // TODO (v0.0.1-Alpha): These tests
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
