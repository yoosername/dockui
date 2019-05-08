const TaskManager = require("./TaskManager");

describe("TaskManager", function() {
  "use strict";

  test("should be defined and loadable", function() {
    expect(TaskManager).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof TaskManager).toBe("function");
  });

  test("should have correct signature", function() {
    const taskManager = new TaskManager();
    expect(typeof taskManager.createTask).toBe("function");
    expect(typeof taskManager.processTasks).toBe("function");
    expect(typeof taskManager.shutdown).toBe("function");
  });

  test("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = jest.spyOn(console, "warn").mockImplementation();
    const taskManager = new TaskManager();
    taskManager.createTask();
    taskManager.processTasks();
    taskManager.shutdown();
    expect(logSpy).toHaveBeenCalledTimes(3);
    logSpy.mockRestore();
  });
});
