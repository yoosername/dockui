const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
var proxyquire = require("proxyquire");
var EventEmitter = require("events");

const {
  MockAppStore,
  MockModuleLoaders,
  MockEventService
} = require("../../../util/mocks");

const {
  URL_APP_LOAD_REQUEST,
  URL_APP_LOAD_STARTED,
  URL_APP_LOAD_COMPLETE,
  URL_APP_LOAD_FAILED
} = require("../../../constants/events");

var mockAppStore = null;
var mockModuleLoaders = null;
var mockEventService = null;
var axiosStub = null;
var axiosCreateStub = null;
var UrlAppLoader = null;
var urlAppLoader = null;

const TEST_APP_KEY = "test-app";
const TEST_APP_DESCRIPTOR_URL = "http://doesntmatter.com/app/dockui.app.yml";
const TEST_VALID_DESCRIPTOR_BODY = `
---
name: Test App
url: ${TEST_APP_DESCRIPTOR_URL}
key: ${TEST_APP_KEY}
description: This is a fake App descriptor for testing (has no modules)
version: 0.1.2
descriptor-version: 1.0.0
lifecycle:
  loaded: "/myurl"
authentication:
  type: "jwt"
`;
const TEST_INVALID_DESCRIPTOR_BODY = `
Some random text
`;

describe("UrlAppLoader", function() {
  "use strict";

  beforeEach(function() {
    mockAppStore = new MockAppStore();
    mockModuleLoaders = new MockModuleLoaders();
    mockEventService = new EventEmitter();
    axiosStub = sinon.stub().resolves({
      body: TEST_VALID_DESCRIPTOR_BODY
    });
    axiosCreateStub = sinon.stub().returns(axiosStub);
    UrlAppLoader = proxyquire("./UrlAppLoader", {
      axios: {
        create: axiosCreateStub
      }
    });
    urlAppLoader = new UrlAppLoader(
      mockAppStore,
      mockModuleLoaders,
      mockEventService
    );
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

  // "scanForNewApps"
  // should detect URL_APP_LOAD_REQUEST event after scanForApps run
  it("should detect URL_APP_LOAD_REQUEST events after scanForNewApps run", function() {
    expect(axiosCreateStub).to.have.been.calledOnce;
    expect(axiosStub).to.not.have.been.called;
    urlAppLoader.scanForNewApps();
    expect(axiosCreateStub).to.have.been.calledOnce;
    expect(axiosStub).to.not.have.been.called;
    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: TEST_APP_DESCRIPTOR_URL
    });
    expect(axiosStub).to.have.been.calledOnce;
    expect(axiosCreateStub).to.have.been.calledOnce;
  });

  //   Should make a network call to the correct url
  it("should make a network call to the correct url", function() {
    urlAppLoader.scanForNewApps();
    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: TEST_APP_DESCRIPTOR_URL
    });
    expect(axiosStub).to.have.been.calledWith({
      method: "get",
      url: TEST_APP_DESCRIPTOR_URL
    });
  });

  //   Should emit URL_APP_LOAD_FAILED event if network fail
  it("should parse and validate descriptor correctly", function(done) {
    const ERR = new Error("Couldnt fetch URL");
    urlAppLoader.client = () => {
      throw ERR;
    };
    urlAppLoader.scanForNewApps();
    mockEventService.on(URL_APP_LOAD_FAILED, payload => {
      expect(payload).to.eql({
        error: ERR,
        url: TEST_APP_DESCRIPTOR_URL
      });
      done();
    });
    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: TEST_APP_DESCRIPTOR_URL
    });
  });

  //  should warn and send Error event if cant parse Yaml
  it("should warn and send Error event if cant parse Yaml", function(done) {
    const ERR_START_STRING =
      "Descriptor was detected as YAML but cannot be parsed";
    axiosStub = sinon.stub().resolves({
      body: TEST_INVALID_DESCRIPTOR_BODY
    });
    axiosCreateStub = sinon.stub().returns(axiosStub);
    UrlAppLoader = proxyquire("./UrlAppLoader", {
      axios: {
        create: axiosCreateStub
      }
    });
    urlAppLoader = new UrlAppLoader(
      mockAppStore,
      mockModuleLoaders,
      mockEventService
    );

    mockEventService.on(URL_APP_LOAD_FAILED, payload => {
      expect(payload.error.startsWith(ERR_START_STRING));
      done();
    });

    urlAppLoader.scanForNewApps();

    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: TEST_APP_DESCRIPTOR_URL
    });
  });

  //  should warn and send Error event if cant build valid App descriptor
  it("should warn and send Error event if cant build valid App descriptor", function(done) {
    const ERR_START_STRING =
      "Descriptor was loaded OK but is not valid App descriptor";
    const APP_DESCRIPTOR_URL = "http://doesntmatter.com/app/dockui.app.json";
    axiosStub = sinon.stub().resolves({
      body: {
        some: "data",
        but: "not-the-right",
        data: true
      }
    });
    axiosCreateStub = sinon.stub().returns(axiosStub);
    UrlAppLoader = proxyquire("./UrlAppLoader", {
      axios: {
        create: axiosCreateStub
      }
    });
    urlAppLoader = new UrlAppLoader(
      mockAppStore,
      mockModuleLoaders,
      mockEventService
    );

    mockEventService.on(URL_APP_LOAD_FAILED, payload => {
      expect(payload.error.startsWith(ERR_START_STRING));
      done();
    });

    urlAppLoader.scanForNewApps();

    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: APP_DESCRIPTOR_URL
    });
  });

  // Should submit a URL_APP_LOAD_STARTED upon start
  it("should submit a URL_APP_LOAD_STARTED upon start", function(done) {
    urlAppLoader.scanForNewApps();
    mockEventService.on(URL_APP_LOAD_STARTED, payload => {
      done();
    });
    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: TEST_APP_DESCRIPTOR_URL
    });
  });

  // Should submit a URL_APP_LOAD_COMPLETE event if successful
  it("should submit a URL_APP_LOAD_COMPLETE event upon successful load", function(done) {
    urlAppLoader.scanForNewApps();
    mockEventService.on(URL_APP_LOAD_FAILED, payload => {
      console.log(payload);
    });
    mockEventService.on(URL_APP_LOAD_COMPLETE, payload => {
      expect(payload.app.getKey()).to.equal(TEST_APP_KEY);
      done();
    });
    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: TEST_APP_DESCRIPTOR_URL
    });
  });

  // Shouldnt load an App (with a key its seen before) a second time.
  it("Shouldnt load an App (with a key its seen before) a second time", function(done) {
    urlAppLoader.scanForNewApps();
    var count = 0;
    mockEventService.on(URL_APP_LOAD_COMPLETE, payload => {
      count++;
    });
    mockEventService.on(URL_APP_LOAD_FAILED, payload => {
      expect(count).to.equal(1);
      expect(urlAppLoader.getApps().length).to.equal(1);
      done();
    });
    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: TEST_APP_DESCRIPTOR_URL
    });
    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: TEST_APP_DESCRIPTOR_URL
    });
  });

  // "stopScanningForNewApps"
  //   should no longer detect URL_APP_LOAD_REQUEST events
  it("should no longer detect URL_APP_LOAD_REQUEST events after stopScanningForNewApps run", function() {
    expect(urlAppLoader.getApps().length).to.equal(0);
    expect(Object.keys(mockEventService._events).length).to.equal(0);
    urlAppLoader.scanForNewApps();
    mockEventService.on(URL_APP_LOAD_COMPLETE, payload => {
      expect(urlAppLoader.getApps().length).to.equal(1);
      expect(urlAppLoader.listeners.length).to.equal(1);
      urlAppLoader.stopScanningForNewApps();
      expect(urlAppLoader.scanning).to.equal(false);
      expect(Object.keys(mockEventService._events).length).to.equal(1);
    });
    mockEventService.emit(URL_APP_LOAD_REQUEST, {
      url: TEST_APP_DESCRIPTOR_URL
    });
  });
});
