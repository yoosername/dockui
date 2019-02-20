const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
var proxyquire = require("proxyquire");

const {
  MockAppStore,
  MockModuleLoaders,
  MockEventService
} = require("../../../util/mocks");

const { URL_APP_LOAD_REQUEST } = require("../../../constants/events");

var mockAppStore = null;
var mockModuleLoaders = null;
var mockEventService = null;
var axiosStub = null;
var UrlAppLoader = null;

describe("UrlAppLoader", function() {
  "use strict";

  beforeEach(function() {
    mockAppStore = new MockAppStore();
    mockModuleLoaders = new MockModuleLoaders();
    mockEventService = new MockEventService();
    axiosStub = sinon.stub().resolves(true);
    UrlAppLoader = proxyquire("./UrlAppLoader", {
      axios: axiosStub
    });
  });

  it("should be defined and loadable", function() {
    expect(UrlAppLoader).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(UrlAppLoader).to.be.a("function");
  });

  it("should validate expected arguments", function() {
    expect(() => {
      new UrlAppLoader();
    }).to.throw();
    expect(() => {
      new UrlAppLoader(mockAppStore, mockModuleLoaders, mockEventService);
    }).to.not.throw();
  });

  // TODO (v0.0.1-Alpha): These tests
  // Methods to Test
  // "scanForNewApps"
  // should detect URL_APP_LOAD_REQUEST event after scanForApps run
  it("should detect URL_APP_LOAD_REQUEST events after scanForNewApps run", function(done) {
    var urlAppLoader = new UrlAppLoader(
      mockAppStore,
      mockModuleLoaders,
      mockEventService
    );
    expect(axiosStub).to.not.have.been.called;
    urlAppLoader.scanForNewApps();
    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: "http://doesntmatter.com/app/dockui.app.yml"
    });
    expect(axiosStub).to.have.been.called.once;
  });

  //   Should make a network call to the correct url
  it("should make a network call to the correct url", function() {});

  //   Should parse the descriptor correctly and validate it before continuing
  it("should parse and valid descriptor correctly", function() {});

  //   Should warn and send Error event if incorrect descriptor
  it("should warn and send Error event if incorrect descriptor", function() {});

  //   Should submit a URL_APP_LOAD_STARTED upon start
  it("should submit a URL_APP_LOAD_STARTED upon start", function() {});

  //   Should download the validated Descriptor to the local file cache and emit event
  it("should download descriptor to file cache and emit FILE_APP_LOAD_REQUEST event", function() {});

  //   Should submit a URL_APP_LOAD_FAILED event if unsuccessful
  it("should submit a URL_APP_LOAD_FAILED event upon failure", function() {});

  //   Should submit a URL_APP_LOAD_COMPLETE event if successful
  it("should submit a URL_APP_LOAD_COMPLETE event upon successful load", function() {});

  // "stopScanningForNewApps"
  //   should no longer detect URL_APP_LOAD_REQUEST events
  it("should no longer detect URL_APP_LOAD_REQUEST events after stopScanningForNewApps run", function() {});
});
