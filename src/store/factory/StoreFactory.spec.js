const expect = require("chai").expect;

const StoreFactory = require("./StoreFactory");
const AppStore = require("../AppStore");

describe("StoreFactory", function() {
  "use strict";

  it("create should return an instance of AppStore", function() {
    const factory = new StoreFactory();
    const manager = factory.create({});
    expect(manager).to.not.be.undefined;
    // Should be type of TaskManager
  });
});
