const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { MockEventService } = require("../../util/mocks");
var mockEventService = null;
var InMemoryAppStore = require("./InMemoryAppStore");

describe("InMemoryAppStore", function() {
  "use strict";

  beforeEach(function() {
    mockEventService = new MockEventService();
  });

  it("should be defined and loadable", function() {
    expect(InMemoryAppStore).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(InMemoryAppStore).to.be.a("function");
  });

  it("should return the same thing you save into it", function() {
    const store = new InMemoryAppStore();
    store.set("TEST1", "value1");
    store.set("TEST2", "value2");
    expect(store.get("TEST2")).to.eql("value2");
    expect(store.get("TEST1")).to.eql("value1");
  });

  it("should delet the correct item", function() {
    const store = new InMemoryAppStore();
    store.set("TEST1", "value1");
    store.set("TEST2", "value2");
    store.set("TEST3", "value3");
    store.delete("TEST2");
    expect(store.get("TEST1")).to.equal("value1");
    expect(store.get("TEST2")).to.equal(undefined);
    expect(store.get("TEST3")).to.equal("value3");
  });
});
