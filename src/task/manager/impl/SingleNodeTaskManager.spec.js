const TaskManager = require("../TaskManager");
const SingleNodeTaskManager = require("./SingleNodeTaskManager");

describe("SingleNodeTaskManager", function() {
  "use strict";

  test("should be defined and a loadable function", async () => {
    expect(SingleNodeTaskManager).not.toBeUndefined();
    expect(typeof SingleNodeTaskManager).toBe("function");
  });

  test("should be able to queue new tasks", async () => {
    const taskManager = new SingleNodeTaskManager();
    const task1 = await taskManager.create("type1", { key: "key1" });
    const task2 = await taskManager.create("type1", { key: "key2" });
    const task3 = await taskManager.create("type2", { key: "key3" });
    task1.commit();
    expect(Object.keys(taskManager.getQueued()).length).toEqual(1);
    task2.commit();
    expect(Object.keys(taskManager.getQueued()).length).toEqual(2);
    task3.commit();
    expect(Object.keys(taskManager.getQueued()).length).toEqual(3);
  });

  test("should be able to assign worker to a task", async done => {
    const taskManager = new SingleNodeTaskManager();
    expect(taskManager.getWorkers().length).toEqual(0);
    const task1 = await taskManager.create("type1", { key: "key1" });
    const worker = await taskManager.process("type1", async task => {
      expect(task).toBe(task1);
      taskManager.shutdown();
      done();
    });
    expect(taskManager.getWorkers().length).toEqual(1);
    await taskManager.start();
    task1.commit();
  });

  test("should be able to close a worker", async () => {
    const taskManager = new SingleNodeTaskManager();
    expect(taskManager.getWorkers().length).toEqual(0);
    const worker = await taskManager.process("type1", async task => {});
    const worker2 = await taskManager.process("type1", async task => {});
    expect(taskManager.getWorkers().length).toEqual(2);
    worker2.close();
    expect(taskManager.getWorkers().length).toEqual(1);
    worker.close();
    expect(taskManager.getWorkers().length).toEqual(0);
  });

  test("should be able to assign worker to a task with certain type", async () => {});
  test("should be able to emit events on task from worker", async () => {});
  test("should be able to remove worker", async () => {});
  test("should be able to detect within worker when task has been cancelled", async () => {});
  test("should be able to commit a task twice with no side effects", async () => {});
});
