const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var ModuleDescriptor = require('./ModuleDescriptor');

describe('ModuleDescriptor', function() {
    "use strict";

    beforeEach(function(){
       
    });

    it('should be defined and loadable', function() {
        expect(ModuleDescriptor).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(ModuleDescriptor).to.be.a('function');
    });

    it('should validate a an object with at least key type and name', function() {
        expect(()=>{
            new ModuleDescriptor();
        }).to.throw();

        expect(()=>{
            new ModuleDescriptor(null,null,null);
        }).to.throw();

        expect(()=>{
            new ModuleDescriptor(undefined,"",false);
        }).to.throw();

        expect(()=>{
            new ModuleDescriptor({
                key : "ModuleKey",
                url : "http://bla.bla"
            });
        }).to.throw();

        expect(()=>{
            new ModuleDescriptor({
                key : "test.module",
                type : "vanilla",
                name : "test module"
            });
        }).to.not.throw();
    });

// Methods to Test

});