const AppLoadWorker = require("./AppLoadWorker");

describe("AppLoadWorker", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(AppLoadWorker).not.toBe(undefined);
    expect(typeof AppLoadWorker).toBe("function");
  });

  test("should load app from passed in AppLoader and Save it to passed in Store", function() {
    const worker = new AppLoadWorker();
  });
});
