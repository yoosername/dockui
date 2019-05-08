var InMemoryAppStore = require("./InMemoryAppStore");

describe("InMemoryAppStore", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(InMemoryAppStore).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof InMemoryAppStore).toBe("function");
  });

  test("should return the same thing you save into it", function() {
    const store = new InMemoryAppStore();
    store.set("TEST1", "value1");
    store.set("TEST2", "value2");
    expect(store.get("TEST2")).toBe("value2");
    expect(store.get("TEST1")).toBe("value1");
  });

  test("should delet the correct item", function() {
    const store = new InMemoryAppStore();
    store.set("TEST1", "value1");
    store.set("TEST2", "value2");
    store.set("TEST3", "value3");
    store.delete("TEST2");
    expect(store.get("TEST1")).toBe("value1");
    expect(store.get("TEST2")).toBe(undefined);
    expect(store.get("TEST3")).toBe("value3");
  });
});
