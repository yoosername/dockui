const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var AppLoader = require('./AppLoader');

describe('AppLoader', function() {
    "use strict";

    beforeEach(function(){
        
    });

    it('should be defined and loadable', function() {
        expect(AppLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(AppLoader).to.be.a('function');
    });

// Methods to Test

});