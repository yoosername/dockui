const expect = require("chai").expect;

const TaskManagerFactory = require("./TaskManagerFactory");
const TaskManager = require("../TaskManager");

describe("TaskManagerFactory", function() {
  "use strict";

  it("create should return an instance of TaskManager", function() {
    const factory = new TaskManagerFactory();
    const manager = factory.create({});
    expect(manager).to.not.be.undefined;
    // Should be type of TaskManager
  });
});
