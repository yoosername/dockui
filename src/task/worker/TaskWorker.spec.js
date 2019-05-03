const TaskWorker = require("./TaskWorker");

describe("TaskWorker", function() {
  "use strict";

  it("should be defined and a loadable function", function() {
    expect(TaskWorker).to.not.be.undefined;
    expect(TaskWorker).to.be.a("function");
  });
});
