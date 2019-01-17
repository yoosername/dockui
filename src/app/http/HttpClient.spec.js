const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const path = require("path");
const moxios = require("moxios");

const  {
  MockApp
} = require("../../util/mocks");

var HttpClient = require('./HttpClient');

describe('HttpClient', function() {
    "use strict";

    beforeEach(function () {
      // import and pass your custom axios instance to this method
      moxios.install();
    });

    afterEach(function () {
      // import and pass your custom axios instance to this method
      moxios.uninstall();
    });

    it('should be defined and loadable', function() {
      expect(HttpClient).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(HttpClient).to.be.a('function');
    });

    // Test that given an App with a particular url a get() uses the correct baseURL
    // Test that given an App with a particular url a post() uses the correct baseURL
    // should be able to subclass HttpClient and override the request with transformRequest 
    // should be able to subclass HttpClient and override the request with transformResponse
    it('should get(relUrl) by appending relUrl to base url of passed in App', function(done) {
      moxios.withMock(function () {
        let reqSpy = sinon.spy();
        let resSpy = sinon.spy();

        class TestingHttpClient extends HttpClient{
          transformRequest(options){
            reqSpy(options);
            return options;
          }
          transformResponse(options){
            resSpy(options);
            return options;
          }
        }

        const BASE_URL="http://localhost:1234/base/test";
        const REL_URL="/some/relative/path";
        const ABS_URL=new URL(BASE_URL+REL_URL);
        
        const app1 = new MockApp();
        const appStub = sinon.stub(app1, "getUrl");
        appStub.returns(BASE_URL);
        
        const httpClient = new TestingHttpClient(app1);
        httpClient.get(REL_URL);
  
        moxios.wait(function () {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              id: 12345, key: 'key', data: 'somedata'
            }
          }).then(function () {
            expect(reqSpy.called).to.equal(true);
            expect(resSpy.called).to.equal(true);
            expect(resSpy.args[0][0].config.url).to.equal(ABS_URL.toString());
            done();
          });
        });
      });
      
    });

    // should be able to subclass HttpClient and override the default client using custom init(client)
    it('should be able to subclass HttpClient and override default client', function(done) {
      
      const clientSpy = sinon.stub();
      clientSpy.returns(new Promise(res => res()));
      class TestingHttpClient extends HttpClient{
        init(client){
          return clientSpy;
        }
      }
      const client = new TestingHttpClient(new MockApp());
      client.get("doesntmatter").then(()=>{
        expect(clientSpy.called).to.equal(true);
        done();
      });

    });
});
