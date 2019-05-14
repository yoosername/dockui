const TaskManagerFactory = require("./TaskManagerFactory");

describe("TaskManagerFactory", function() {
  "use strict";

  it("should be defined and a loadable function", function() {
    expect(TaskManagerFactory).not.toBeUndefined();
    expect(typeof TaskManagerFactory).toBe("object");
    expect(typeof TaskManagerFactory.create).toBe("function");
  });

  it("should return a valid TaskManager instance with or without config", function() {
    const taskManager = TaskManagerFactory.create();
    expect(typeof taskManager).toBe("function");
  });
});
