const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var AppDescriptor = require('./AppDescriptor');

describe('AppDescriptor', function() {
    "use strict";

    beforeEach(function(){
       
    });

    it('should be defined and loadable', function() {
        expect(AppDescriptor).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(AppDescriptor).to.be.a('function');
    });

    it('should validate a correct JSON obj', function() {
        expect(()=>{
            new AppDescriptor();
        }).to.throw();

        expect(()=>{
            new AppDescriptor(null,null,null);
        }).to.throw();

        expect(()=>{
            new AppDescriptor(undefined,"",false);
        }).to.throw();

        expect(()=>{
            new AppDescriptor({
                key : "AppKey",
                url : "http://bla.bla"
            });
        }).to.throw();

        expect(()=>{
            new AppDescriptor({
                key : "AppKey",
                url : "http://bla.bla",
                lifecycle : {
                    loaded : "/myurl"
                },
                authentication : {
                    type : "jwt"
                }
            });
        }).to.not.throw();
    });

// Methods to Test

});