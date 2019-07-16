var LokiAppStore = require("./LokiAppStore");
let lokijs = require("lokijs");

jest.mock("lokijs");

let loki,
  store = null;

describe("LokiAppStore", function() {
  "use strict";

  beforeEach(function() {
    loki = new lokijs("bla", {
      autosave: false
    });
    loki.loadDatabase = jest.fn();
    store = new LokiAppStore({ loki });
    store.collection = {
      insert: jest.fn().mockImplementation(),
      findOne: jest.fn().mockImplementation(),
      update: jest.fn().mockImplementation(),
      remove: jest.fn().mockImplementation(),
      where: jest.fn().mockImplementation()
    };
  });

  afterEach(function() {
    loki.loadDatabase.mockReset();
    store.collection.insert.mockReset();
    store.collection.findOne.mockReset();
    store.collection.update.mockReset();
    store.collection.remove.mockReset();
  });

  test("should be defined and loadable", function() {
    expect(LokiAppStore).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof LokiAppStore).toBe("function");
  });

  test("create should delegate to insert", function() {
    const obj1 = { id: "id1", key1: "value1" };
    const obj2 = { id: "id2", key2: "value2" };
    store.create(obj1);
    expect(store.collection.insert).toHaveBeenCalledWith(obj1);
    store.create(obj2);
    expect(store.collection.insert).toHaveBeenCalledWith(obj2);
  });

  test("delete should delegate to loki remove", function() {
    const testId = "testId";
    const testRemovable = { id: testId, data: "testData" };
    store.collection.findOne.mockImplementation(() => {
      return testRemovable;
    });
    store.delete(testId);
    expect(store.collection.findOne).toHaveBeenCalledWith({ id: "testId" });
    expect(store.collection.remove).toHaveBeenCalledWith(testRemovable);
  });

  test("find should delegate to loki where", function() {
    const predicate = item => {
      return item.stage === "first";
    };
    let found = store.find(predicate);
    expect(store.collection.where).toHaveBeenCalledWith(predicate);
  });

  test("update should delegate to loki update", function() {
    const obj = { id: "id1", key1: "value1", stage: "first" };
    store.collection.findOne.mockReturnValue({});
    store.update(obj.id, obj);
    expect(store.collection.findOne).toHaveBeenCalledWith({ id: obj.id });
    expect(store.collection.update).toHaveBeenCalledWith(obj);
  });
});
