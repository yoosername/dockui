var AppStore = require("./AppStore");

describe("AppStore", function() {
  "use strict";

  beforeEach(function() {});

  // TODO: Remove generic store methods as it doesnt seem to add value.
  // TODO: Add methods to add/update and fetch all known models
  // TODO: Add methods to search for lists of Models based on some filter.

  it("should be defined and loadable", function() {
    expect(AppStore).not.toBeUndefined();
  });

  it("should be a function", function() {
    expect(typeof AppStore).toBe("function");
    expect(() => {
      new AppStore();
    }).not.toThrow();
  });

  it("should have correct signature", function() {
    const store = new AppStore();
    expect(typeof store.get).toBe("function");
    expect(typeof store.set).toBe("function");
    expect(typeof store.delete).toBe("function");
  });

  it("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = jest.spyOn(console, "warn").mockImplementation();
    const store = new AppStore();
    store.get();
    store.set();
    store.delete();
    expect(logSpy).toHaveBeenCalledTimes(3);
    logSpy.mockReset();
  });
});
