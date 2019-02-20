const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

var UrlAppLoader = require("./UrlAppLoader");

describe("UrlAppLoader", function() {
  "use strict";

  beforeEach(function() {});

  it("should be defined and loadable", function() {
    expect(UrlAppLoader).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(UrlAppLoader).to.be.a("function");
  });

  // TODO (v0.0.2-Alpha): These tests
  // Methods to Test
  // "scanForNewApps"
  //   should detect FILE_APP_LOAD_EVENT event after scanForApps run
  it("should detect FILE_APP_LOAD_EVENT events after scanForNewApps run", function() {});

  //  Should load the correct cached descriptor file
  it("should load the correct cached descriptor file", function() {});

  //   Should parse the descriptor correctly
  it("should parse a valid descriptor correctly", function() {});

  //   Should warn and send Error event if incorrect descriptor
  it("should warn and send Error event if incorrect descriptor", function() {});

  //   Should submit a FILE_APP_LOAD_STARTED upon start
  it("should submit a FILE_APP_LOAD_STARTED upon start", function() {});

  //   Should submit a FILE_APP_LOAD_FAILED event if unsuccessful
  it("should submit a FILE_APP_LOAD_FAILED event upon failure", function() {});

  //   Should submit a FILE_APP_LOAD_COMPLETE event if successful
  it("should submit a FILE_APP_LOAD_COMPLETE event upon successful load", function() {});

  // "stopScanningForNewApps"
  //   should no longer detect URL_APP_LOAD_EVENT events
  it("should no longer detect FILE_APP_LOAD_EVENT events after stopScanningForNewApps run", function() {});

  // "getApps",
  //   using 2 correct Descriptors should return 2 Apps with correct info
  it("should return 2 correct Apps from getApps following 2 successful loads with 2 different descriptors", function() {});

  //   using 1 correct and 1 incorrect Descriptors should return 1 App with correct info
  it("should return 1 correct App from getApps following 1 successful loads and 1 fail from 2 different descriptors", function() {});
});
