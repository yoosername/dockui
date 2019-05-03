const AppLoaderTaskWorker = require("./AppLoaderTaskWorker");

describe("AppLoaderTaskWorker", function() {
  "use strict";

  it("should be defined and a loadable function", function() {
    expect(AppLoaderTaskWorker).to.not.be.undefined;
    expect(AppLoaderTaskWorker).to.be.a("function");
  });
});
