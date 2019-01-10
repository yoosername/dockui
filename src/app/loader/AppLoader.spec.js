const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const  {
    MockAppStore,
    MockModuleLoaders,
    MockEventService
  } = require("../../util/mocks");

var AppLoader = require('./AppLoader');

var mockAppStore = null;
var mockModuleLoaders = null;
var mockEventService = null;

describe('AppLoader', function() {
    "use strict";

    beforeEach(function(){
        mockAppStore = new MockAppStore();
        mockModuleLoaders = new MockModuleLoaders();
        mockEventService = new MockEventService();
    });

    it('should be defined and loadable', function() {
        expect(AppLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(AppLoader).to.be.a('function');
    });

    it('should validate its arguments correctly', function() {
        expect(()=>{
            new AppLoader();
        }).to.throw();

        expect(()=>{
            new AppLoader(null,null,null);
        }).to.throw();

        expect(()=>{
            new AppLoader(undefined,"",false);
        }).to.throw();

        expect(()=>{
            new AppLoader(mockAppStore,mockModuleLoaders,mockEventService);
        }).to.not.throw();
    });

// Methods to Test

});