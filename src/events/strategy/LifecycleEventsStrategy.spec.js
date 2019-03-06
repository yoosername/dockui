const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const LifecycleEventsStrategy = require("./LifecycleEventsStrategy");

const {
  MockAppService,
  MockAppStore,
  MockEventService
} = require("../../util/mocks");

var mockAppService = null;
var mockAppStore = null;
var mockEventService = null;

describe("LifecycleEventsStrategy", function() {
  "use strict";

  beforeEach(function() {
    mockAppService = new MockAppService();
    mockAppStore = new MockAppStore();
    mockEventService = new MockEventService();
  });

  it("should be defined and loadable", function() {
    expect(LifecycleEventsStrategy).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(LifecycleEventsStrategy).to.be.a("function");
  });

  it("should throw if incorrect or missing args", function() {
    expect(function() {
      new LifecycleEventsStrategy();
    }).to.throw();
    expect(function() {
      new LifecycleEventsStrategy("", "", "");
    }).to.throw();
    expect(function() {
      new LifecycleEventsStrategy(null, null, null);
    }).to.throw();
    expect(function() {
      new LifecycleEventsStrategy(undefined, undefined, undefined);
    }).to.throw();
    expect(function() {
      new LifecycleEventsStrategy({}, {}, {});
    }).to.throw();
    expect(function() {
      new LifecycleEventsStrategy(
        {
          get: {},
          set: {}
        },
        {},
        {}
      );
    }).to.throw();
    expect(function() {
      new LifecycleEventsStrategy(mockEventService, mockAppStore);
    }).to.not.throw();
  });

  it("should have correct signature", function() {
    const lifecycleEventsStrategy = new LifecycleEventsStrategy(
      mockEventService,
      mockAppStore
    );
    expect(lifecycleEventsStrategy.setup).to.be.a("function");
    expect(lifecycleEventsStrategy.teardown).to.be.a("function");
  });

  it("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = sinon.stub(console, "warn");
    const lifecycleEventsStrategy = new LifecycleEventsStrategy(
      mockEventService,
      mockAppStore
    );
    lifecycleEventsStrategy.setup();
    lifecycleEventsStrategy.teardown();
    expect(logSpy).to.be.called.callCount(2);
    logSpy.restore();
  });
});
