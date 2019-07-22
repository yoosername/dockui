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
let testDockUIInstance = null;

const testAppId = "8377421503e4abbf4d31793b33d0aa4f270844ee";
const testApp2Id = "1add31314ed6ac4cdd32be0435deda8091b2bd8a";
const testApp1 = {
  name: "1",
  id: testAppId,
  key: "1",
  enabled: "true",
  permission: "read"
};
const testApp2 = {
  name: "1",
  id: testApp2Id,
  key: "1",
  enabled: "false",
  permission: "write"
};
const testAppList = [testApp1, testApp2];

describe("CLI", function() {
  "use strict";

  beforeEach(function() {
    config = new Config();
    config.set("store.type", "memory");
    config.set("web.port", "1234");
    logger = new Logger(config);
    voidConsole = { log: jest.fn().mockImplementation() };
    testDockUIInstance = new Instance();
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
      instance: testDockUIInstance,
      config: config
    });
    expect(cli.getConfig().get("store.type")).toBe("memory");
    expect(cli.getConfig().get("web.port")).toBe("1234");
  });

  // Should log usage when --help is passed on command line
  test("should log usage when --help is passed as Arg", done => {
    cli = new CLI({
      instance: testDockUIInstance,
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
      instance: testDockUIInstance,
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
    await cli.parse(["node", "dockui", "--help", "-vvvvvvv"]);
    expect(voidConsole.log.mock.calls[7][0]).toContain("Log Level:  silly");
    await cli.parse(["node", "dockui", "--help", "-vvvvvvvvvvvvvv"]);
    expect(voidConsole.log.mock.calls[8][0]).toContain("Log Level:  silly");
  });

  // COMMAND TESTS
  // Instance Commands to test
  // (1) Run an instance of the DockUI framework
  //     - This should output all required details to STDOUT like web host and port being used
  //     - Required security keys etc are accessed via the DB, which in the case of the default is a well defined persistent in memory DB
  //
  //     $ dockui run
  test("should run an instance of dockui)", async function() {
    expect(testDockUIInstance.start).not.toHaveBeenCalled();
    cli = new CLI({
      instance: testDockUIInstance
    });
    await cli.parse(["node", "dockui", "run"]);
    expect(testDockUIInstance.start).toHaveBeenCalled();
  });

  // List Loaded Apps
  // ┌──────────────────────┬──────────────────────────────────────┬──────────────────────┬─────────┬────────────┐
  // │ App                  │ Id                                   │ Key                  │ Enabled │ Permission │
  // ├──────────────────────┼──────────────────────────────────────┼──────────────────────┼─────────┼────────────┤
  // │ DockUI Dashboard App │ cfc3ad93-cfed-4b55-b9be-402ebae91839 │ dockui.dashboard.app │ true    │ read       │
  // └──────────────────────┴──────────────────────────────────────┴──────────────────────┴─────────┴────────────┘
  test("should list running apps of a connected running instance)", async function() {
    const testFetcher = jest
      .fn()
      .mockResolvedValue({ statusCode: 200, body: testAppList });
    const screenSpy = { log: jest.fn() };
    cli = new CLI({
      instance: testDockUIInstance,
      formatters: {
        apps: apps => {
          return apps;
        }
      },
      fetcher: testFetcher,
      screen: screenSpy
    });
    await cli.parse(["node", "dockui", "-i", "bla", "ls"]);
    expect(screenSpy.log).toHaveBeenCalled();
    expect(screenSpy.log.mock.calls[0][0]).toBe(testAppList);
  });

  // Load an App into a running instance (optionally setting permission)
  // $ dockui load <url> [permission]
  test("should load an app into a running instance of dockui)", async function() {
    const testFetcher = jest
      .fn()
      .mockResolvedValue({ statusCode: 200, body: testApp1 });
    const screenSpy = { log: jest.fn() };
    cli = new CLI({
      instance: testDockUIInstance,
      formatters: {
        app: app => {
          return app;
        }
      },
      fetcher: testFetcher,
      screen: screenSpy
    });
    // With Permission
    await cli.parse([
      "node",
      "dockui",
      "-i",
      "bla",
      "load",
      "someUrl",
      "--permission",
      "READ"
    ]);
    expect(screenSpy.log).toHaveBeenCalled();
    expect(screenSpy.log.mock.calls[0][0]).toBe(testAppId);
    // Without Permission
    await cli.parse(["node", "dockui", "-i", "bla", "load", "someUrl"]);
  });

  // (5) Enable a loaded APP which is disabled:
  // $ dockui enable <appId>
  test("should enable a loaded app)", async function() {
    const testFetcher = jest
      .fn()
      .mockResolvedValue({ statusCode: 200, body: testApp1 });
    const screenSpy = { log: jest.fn() };
    cli = new CLI({
      instance: testDockUIInstance,
      formatters: {
        app: app => {
          return app;
        }
      },
      fetcher: testFetcher,
      screen: screenSpy
    });
    await cli.parse(["node", "dockui", "-i", "bla", "enable", testAppId]);
    expect(screenSpy.log).toHaveBeenCalled();
    expect(screenSpy.log.mock.calls[0][0]).toBe(testAppId);
  });
});
