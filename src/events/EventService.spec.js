const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const EventService = require("./EventService");

describe("EventService", function() {
  "use strict";

  it("should be defined and loadable", function() {
    expect(EventService).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(EventService).to.be.a("function");
  });

  it("should be able to be used with or without the new operator", function() {
    var withNewOperator = new EventService();
    expect(withNewOperator).to.be.an.instanceOf(EventService);

    var withoutNewOperator = new EventService();
    expect(withoutNewOperator).to.be.an.instanceOf(EventService);
  });

  it("should have correct signature", function() {
    const eventsService = new EventService();
    expect(eventsService.on).to.be.a("function");
    expect(eventsService.addEventListener).to.be.a("function");
    expect(eventsService.removeEventListener).to.be.a("function");
    expect(eventsService.emit).to.be.a("function");
  });

  it("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = sinon.stub(console, "warn");
    const eventsService = new EventService();
    eventsService.on();
    eventsService.addEventListener();
    eventsService.removeEventListener();
    eventsService.emit();
    expect(logSpy).to.be.called.callCount(4);
    logSpy.restore();
  });
});
