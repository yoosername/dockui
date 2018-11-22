const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var WebService = require('./WebService');

describe('WebService', function() {
    "use strict";

    beforeEach(function(){
      
    });

    it('should be defined and loadable', function() {
      expect(WebService).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(WebService).to.be.a('function');
    });

    // Test start
    // Test stop

});
