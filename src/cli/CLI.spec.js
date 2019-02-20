const chai = require("chai");
const expect = chai.expect;

var CLI = require("./CLI");

describe("CLI", function() {
  "use strict";

  beforeEach(function() {});

  it("should be defined and loadable", function() {
    expect(CLI).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(CLI).to.be.a("function");
  });

  // TODO (v0.0.1-Alpha): These tests
  // Keep this in mind: https://12factor.net/
  //
  // Generic things to test
  // Should produce usage when --help is specified
  // Should be configurable by ENV var based config
  // Should work without ENV vars and provide sensible defaults (for example in memory store)

  // When you run an instance it isnt unique in any way. It should be persitable via connection external service like DB
  // You can run multiple instances on one host.
  // logging is via the standard output stream

  // Instance Commands to test
  // (1) Run an instance of the DockUI framework
  //     - This should output all required details to STDOUT like web host and port being used
  //     - Required security keys etc are accessed via the DB, which in the case of the default is a well defined persistent in memory DB
  //
  //     $ dockui run

  // (2) List management information about the running instance
  //
  //     $ dockui info
  //
  // Dockui Info
  // ------------------------------------------------------------------------------------------------------
  // DB: memory://~/.dockui/db
  // Messaging: rabbitmq://127.0.0.1:5672
  // Admin Access Key: ce33fee.dd467a987a.34ace31
  // Web: http://127.0.0.1/8080/dockui
  // ------------------------------------------------------------------------------------------------------

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
  // (7) Standardize the logging output format.
  //       Do it 12 factor style. Aka log to STDOUT,
  //       but allow customization of verbosity
});
