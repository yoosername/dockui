const TaskWorker = require("./TaskWorker");

describe("TaskWorker", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(TaskWorker).not.toBeUndefined();
    expect(typeof TaskWorker).toBe("function");
  });
});
