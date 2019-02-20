const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

var SecurityContext = require("./SecurityContext");

describe("SecurityContext", function() {
  "use strict";

  beforeEach(function() {});

  it("should be defined and loadable", function() {
    expect(SecurityContext).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(SecurityContext).to.be.a("function");
  });

  // Test getNewContext
  //   should have same UUID and key as the passed in App
  //   should reuse the one in the store if there is one
  //   should reuse the one held in cache if is one
  //   should call generateNewContext if isnt one
  // Test generateNewContext
  //   Should return the correct shape
});
