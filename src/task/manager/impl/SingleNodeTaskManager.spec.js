const expect = require("chai").expect;

const TaskManager = require("../TaskManager");
const SingleNodeTaskManager = require("./SingleNodeTaskManager");

describe("SingleNodeTaskManager", function() {
  "use strict";

  it("should be defined and a loadable function", function() {
    expect(SingleNodeTaskManager).to.not.be.undefined;
    expect(SingleNodeTaskManager).to.be.a("function");
  });
});
