const StoreFactory = require("./StoreFactory");
const AppStore = require("../AppStore");

describe("StoreFactory", function() {
  "use strict";

  test("create should return an instance of AppStore", function() {
    const store = StoreFactory.create();
    expect(store).not.toBeUndefined();
    expect(typeof store).toBe("object");
    expect(store instanceof AppStore).toBe(true);
  });
});
