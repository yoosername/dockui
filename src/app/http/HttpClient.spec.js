const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var HttpClient = require('./HttpClient');

describe('HttpClient', function() {
    "use strict";

    beforeEach(function(){
      
    });

    it('should be defined and loadable', function() {
      expect(HttpClient).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(HttpClient).to.be.a('function');
    });

    // TODO: These tests
    // Test that given an App with a particular url a get() uses the correct baseURL
    // Test that given an App with a particular url a post() uses the correct baseURL
    // should be able to subclass HttpClient and override the default client using custom init(client)
    // should be able to subclass HttpClient and override the request with transformRequest 
    // should be able to subclass HttpClient and override the request with transformResponse

});
