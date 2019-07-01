const CLI = require("./CLI");
const { Instance } = require("../Instance");
const { Config } = require("../..");
const Logger = require("../log/Logger");

jest.mock("../Instance");
jest.mock("../log/Logger");

let config = null;
let logger = null;
let voidConsole = null;
let cli = null;

describe("CLI", function() {
  "use strict";

  beforeEach(function() {
    config = new Config();
    config.set("store.type", "memory");
    config.set("web.port", "1234");
    logger = new Logger(config);
    voidConsole = { log: jest.fn().mockImplementation() };
  });

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(CLI).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof CLI).toBe("function");
  });

  // GENERIC TESTS
  // Should be configurable by passing in a config object
  test("should be configurable by passing in a config", function() {
    cli = new CLI({
      instance: new Instance(),
      config: config
    });
    expect(cli.getConfig().get("store.type")).toBe("memory");
    expect(cli.getConfig().get("web.port")).toBe("1234");
  });

  // Should log usage when --help is passed on command line
  test("should log usage when --help is passed as Arg", done => {
    cli = new CLI({
      instance: new Instance(),
      config: config,
      screen: voidConsole
    });
    expect(voidConsole.log).not.toHaveBeenCalled();
    return cli
      .parse(["node", "dockui", "--help"])
      .then(() => {
        expect(voidConsole.log).toHaveBeenCalled();
        expect(voidConsole.log.mock.calls[0][0]).toContain("Usage");
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
    cli = new CLI({
      instance: new Instance(),
      config: config,
      screen: voidConsole
    });
    expect(voidConsole.log).not.toHaveBeenCalled();
    await cli.parse(["node", "dockui", "--help"]);
    expect(voidConsole.log.mock.calls[0][0]).toContain("Log Level:  info");
    await cli.parse(["node", "dockui", "--help", "-v"]);
    expect(voidConsole.log.mock.calls[1][0]).toContain("Log Level:  error");
    await cli.parse(["node", "dockui", "--help", "-vv"]);
    expect(voidConsole.log.mock.calls[2][0]).toContain("Log Level:  warn");
    await cli.parse(["node", "dockui", "--help", "-vvv"]);
    expect(voidConsole.log.mock.calls[3][0]).toContain("Log Level:  info");
    await cli.parse(["node", "dockui", "--help", "-vvvv"]);
    expect(voidConsole.log.mock.calls[4][0]).toContain("Log Level:  verbose");
    await cli.parse(["node", "dockui", "--help", "-vvvvv"]);
    expect(voidConsole.log.mock.calls[5][0]).toContain("Log Level:  debug");
    await cli.parse(["node", "dockui", "--help", "-vvvvvv"]);
    expect(voidConsole.log.mock.calls[6][0]).toContain("Log Level:  silly");
  });

  // COMMAND TESTS
  // Instance Commands to test
  // (1) Run an instance of the DockUI framework
  //     - This should output all required details to STDOUT like web host and port being used
  //     - Required security keys etc are accessed via the DB, which in the case of the default is a well defined persistent in memory DB
  //
  //     $ dockui run
  test("should run an instance of dockui)", async function() {
    const instance = new Instance();
    expect(instance.start).not.toHaveBeenCalled();
    cli = new CLI({
      instance: instance
    });
    await cli.parse(["node", "dockui", "run"]);
    expect(instance.start).toHaveBeenCalled();
  });

  // ┌──────────────────────┬──────────────────────────────────────┬──────────────────────┬─────────┬────────────┐
  // │ App                  │ Id                                   │ Key                  │ Enabled │ Permission │
  // ├──────────────────────┼──────────────────────────────────────┼──────────────────────┼─────────┼────────────┤
  // │ DockUI Dashboard App │ cfc3ad93-cfed-4b55-b9be-402ebae91839 │ dockui.dashboard.app │ true    │ read       │
  // └──────────────────────┴──────────────────────────────────────┴──────────────────────┴─────────┴────────────┘

  // TODO (v0.0.1-Alpha): These tests ( all should wrap the web API )
  test("should run an instance of dockui)", async function() {
    const instance = new Instance();
    const appList = [
      { name: "1", id: "1", key: "1", enabled: "true", permission: "read" },
      { name: "2", id: "2", key: "2", enabled: "false", permission: "read" }
    ];
    const testFetcher = jest.fn().mockResolvedValue(appList);
    const screenSpy = { log: jest.fn() };
    cli = new CLI({
      instance: instance,
      formatters: {
        apps: apps => {
          return apps;
        }
      },
      fetcher: testFetcher,
      screen: screenSpy
    });
    await cli.parse(["node", "dockui", "-i", "bla", "app", "ls"]);
    expect(screenSpy.log).toHaveBeenCalled();
    expect(screenSpy.log.mock.calls[0][0]).toBe(appList);
  });
  // (3) List Loaded Apps
  //
  //     $ dockui app ls
  //
  // App                   UUID         Loaded        Enabled            Permission
  // ------------------------------------------------------------------------------
  // Demo Theme App        3cd6745f     true          true               READ
  // Demo Dynamic App      37fe3c2c     false         false              ADMIN
  // Demo Dynamic App2     c6cc4af6     true          false              NONE

  // (4) Load an App
  //
  //     $ dockui app load [--permission <permission>] <url>|<dockerImage>|<gitRepo>|<filename>

  // (5) Enable a loaded APP which is disabled:
  //
  //     $ dockui app enable <uuid>

  // (6) Gracefully stop the running DockUI instance
  //
  //     $ Ctrl+C or SIGTERM
  //
});
