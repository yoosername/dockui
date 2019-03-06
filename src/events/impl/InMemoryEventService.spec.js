const expect = require("chai").expect;

const EventService = require("../EventService");
const InMemoryEventService = require("./InMemoryEventService");

describe("InMemoryEventService", function() {
  "use strict";

  it("should be defined and loadable", function() {
    expect(InMemoryEventService).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(InMemoryEventService).to.be.a("function");
  });

  it("should be able to be used with or without the new operator", function() {
    var withNewOperator = new InMemoryEventService();
    expect(withNewOperator).to.be.an.instanceOf(EventService);

    var withoutNewOperator = new InMemoryEventService();
    expect(withoutNewOperator).to.be.an.instanceOf(EventService);
  });

  it("should emit an event when emit() is called with the correct payload", function(done) {
    const es = new InMemoryEventService();
    const eventPayload = {
      action: "thing"
    };
    es.on("test:event", function(payload) {
      expect(payload).to.eql(eventPayload);
      done();
    });
    es.emit("test:event", eventPayload);
  });
});
