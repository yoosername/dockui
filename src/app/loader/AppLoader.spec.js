const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const {
  MockApp,
  MockAppStore,
  MockModuleLoaders,
  MockEventService
} = require("../../util/mocks");

var AppLoader = require("./AppLoader");

var mockAppStore = null;
var mockModuleLoaders = null;
var mockEventService = null;

describe("AppLoader", function() {
  "use strict";

  beforeEach(function() {
    mockAppStore = new MockAppStore();
    mockModuleLoaders = new MockModuleLoaders();
    mockEventService = new MockEventService();
  });

  it("should be defined and a loadable function", function() {
    expect(AppLoader).to.not.be.undefined;
    expect(AppLoader).to.be.a("function");
  });
});
