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

  // GENERIC TESTS
  // (a) Should log usage when --help is passed on command line

  // (b) Should be configurable by a heirarchy of ConfigLoaders

  // (c) Should work without Configuration with sensible defaults

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
