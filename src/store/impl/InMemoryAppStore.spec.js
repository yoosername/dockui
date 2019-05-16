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
    const obj1 = { id: "id1", key1: "value1" };
    const obj2 = { id: "id2", key2: "value2" };
    const store = new InMemoryAppStore();
    store.create(obj1);
    store.create(obj2);
    expect(store.read(obj1.id)).toBe(obj1);
    expect(store.read(obj2.id)).toBe(obj2);
  });

  test("should delete the correct item", function() {
    const obj1 = { id: "id1", key1: "value1" };
    const obj2 = { id: "id2", key2: "value2" };
    const store = new InMemoryAppStore();
    store.create(obj1);
    store.create(obj2);
    expect(store.read(obj1.id)).toBe(obj1);
    expect(store.read(obj2.id)).toBe(obj2);
    store.delete(obj2.id);
    expect(store.read(obj1.id)).toBe(obj1);
    expect(store.read(obj2.id)).toBe(null);
  });

  test("should be able to find an item via one or more properties", function() {
    const obj1 = { id: "id1", key1: "value1", stage: "first" };
    const obj2 = { id: "id2", key2: "value2", stage: "first" };
    const obj3 = { id: "id3", key3: "value3", stage: "second" };
    const store = new InMemoryAppStore();
    store.create(obj1);
    store.create(obj2);
    store.create(obj3);
    let found = store.find(item => {
      return item.stage === "first";
    });
    expect(found.length).toEqual(2);
    store.delete(obj2.id);
    found = store.find(item => {
      return item.stage === "first";
    });
    expect(found.length).toEqual(1);
  });

  test("should be able to update existing data with a partial", function() {
    const obj = { id: "id1", key1: "value1", stage: "first" };
    const objUpdatePartial = { stage: "second" };
    const store = new InMemoryAppStore();
    store.create(obj);
    expect(store.read("id1")).toEqual(obj);
    store.update(obj.id, objUpdatePartial);
    expect(store.read("id1")).toEqual(Object.assign({}, obj, objUpdatePartial));
  });
});
