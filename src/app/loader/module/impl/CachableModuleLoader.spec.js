const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

var CachableModuleLoader = require("./CachableModuleLoader");

describe("CachableModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  it("should be defined and loadable", function() {
    expect(CachableModuleLoader).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(CachableModuleLoader).to.be.a("function");
    expect(() => {
      new CachableModuleLoader();
    }).not.to.throw();
    expect(new CachableModuleLoader()).to.be.an.instanceOf(
      CachableModuleLoader
    );
  });

  it("should return from the cache the same as you put into it", function() {
    const loader = new CachableModuleLoader();
    const descriptor = {
      type: "fakeDescriptor",
      url: "/some/url",
      name: "name",
      key: "key"
    };
    const state = {
      loaded: true,
      descriptor: descriptor,
      module: {}
    };
    loader.setCache(descriptor, state);
    var cachedState = loader.getCache(descriptor);
    expect(cachedState).to.eql(state);
  });
});
