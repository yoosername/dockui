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
    expect(typeof taskManager.create).toBe("function");
    expect(typeof taskManager.process).toBe("function");
    expect(typeof taskManager.start).toBe("function");
    expect(typeof taskManager.shutdown).toBe("function");
  });

  test("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = jest.spyOn(console, "warn").mockImplementation();
    const taskManager = new TaskManager();
    taskManager.create();
    taskManager.process();
    taskManager.start();
    taskManager.shutdown();
    expect(logSpy).toHaveBeenCalledTimes(4);
    logSpy.mockRestore();
  });
});
