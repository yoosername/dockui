const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var UrlAppLoader = require('./UrlAppLoader');

describe('UrlAppLoader', function() {
    "use strict";

    beforeEach(function(){
        
    });

    it('should be defined and loadable', function() {
        expect(UrlAppLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(UrlAppLoader).to.be.a('function');
    });

// Methods to Test
// "scanForNewApps"
//   Should detect URL_APP_LOAD_EVENT events
//   should find App Desriptor from valid Url and be able to Parse it
//   Should send URL_APP_LOAD_STARTED event
//   Should send URL_APP_LOAD_COMPLETE event
//   Should send URL_APP_LOAD_FAILED event when cant parse Descriptor or other errors
// "stopScanningForNewApps"
//   Should no longer detect or respond to URL_APP_LOAD_EVENT events
// "getApps",
//   using 2 correct Descriptors should return 2 Apps with correct info
//   using 1 correct and 1 incorrect Descriptors should return 1 App with correct info

});