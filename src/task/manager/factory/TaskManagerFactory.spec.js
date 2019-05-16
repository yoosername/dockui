const TaskManagerFactory = require("./TaskManagerFactory");
const TaskManager = require("../TaskManager");

describe("TaskManagerFactory", function() {
  "use strict";

  test("create should return an instance of TaskManager", function() {
    const taskManager = TaskManagerFactory.create();
    expect(taskManager).not.toBeUndefined();
    expect(typeof taskManager).toBe("object");
    expect(taskManager instanceof TaskManager).toBe(true);
  });
});
