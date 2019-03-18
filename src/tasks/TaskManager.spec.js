const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const TaskManager = require("./TaskManager");

describe("TaskManager", function() {
  "use strict";

  it("should be defined and loadable", function() {
    expect(TaskManager).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(TaskManager).to.be.a("function");
  });

  it("should have correct signature", function() {
    const taskManager = new TaskManager();
    expect(taskManager.create).to.be.a("function");
    expect(taskManager.process).to.be.a("function");
    expect(taskManager.shutdown).to.be.a("function");
  });

  it("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = sinon.stub(console, "warn");
    const taskManager = new TaskManager();
    taskManager.create();
    taskManager.process();
    taskManager.shutdown();
    expect(logSpy).to.be.called.callCount(3);
    logSpy.restore();
  });
});
