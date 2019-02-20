const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

var AppPermission = require("./AppPermission");

describe("AppPermission", function() {
  "use strict";

  beforeEach(function() {});

  it("should be defined and loadable", function() {
    expect(AppPermission).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(AppPermission).to.be.an("object");
  });

  it("should only contain READ,WRITE,ADMIN", function() {
    expect(AppPermission.READ).to.be.a("string");
    expect(AppPermission.WRITE).to.be.a("string");
    expect(AppPermission.ADMIN).to.be.a("string");

    expect(Object.keys(AppPermission).length).to.equal(3);
  });
});
