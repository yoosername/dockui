const Task = require("./Task");

describe("Task", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(Task).not.toBeUndefined();
    expect(typeof Task).toBe("function");
  });

  test("should be able to create with or without type and payload", function() {
    let task = new Task();
    expect(task.getType()).toEqual("default");
    task = new Task("customType");
    expect(task.getType()).toEqual("customType");
    expect(task.getPayload()).toEqual({});
    task = new Task("customType2", { payloadKey: "payloadValue" });
    expect(task.getType()).toEqual("customType2");
    expect(task.getPayload()).toEqual({ payloadKey: "payloadValue" });
  });

  test("should be able to set timeout period", function() {
    let task = new Task();
    task.withTimeout(10000);
    expect(task.getTimeout()).toEqual(10000);
    task.withTimeout(800);
    expect(task.getTimeout()).toEqual(800);
  });

  test("should be able to set delayUntil", function() {
    let task = new Task();
    const futureDate = new Date() + 20000;
    task.withDelayUntil(futureDate);
    expect(task.getDelayUntil()).toEqual(futureDate);
  });

  test("should emit event when committed", function(done) {
    let task = new Task()
      .withTimeout(10000)
      .withDelayUntil(new Date())
      .on(Task.events.COMMIT_EVENT, () => {
        done();
      })
      .commit();
  });
});
