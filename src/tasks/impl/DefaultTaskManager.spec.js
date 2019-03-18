const expect = require("chai").expect;

const TaskManager = require("../TaskManager");
const DefaultTaskManager = require("./DefaultTaskManager");

describe("DefaultTaskManager", function() {
  "use strict";

  it("should be defined and loadable", function() {
    expect(DefaultTaskManager).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(DefaultTaskManager).to.be.a("function");
  });
});
