import sinon from 'sinon';
import Handler from '../../../../src/main/send-request-handler';
import Auth from '../../../../src/common/auth-types';

describe('SendRequestHandler', () => {
  describe('createIpcResponse', () => {
    it('should create an internal response representation', () => {
      const httpResponse = { data: 'response body' };

      const expectedResponse = { body: httpResponse.data };

      const actualResponse = Handler.createIpcResponse(httpResponse);
      expect(actualResponse).to.eql(expectedResponse);
    });
  });

  describe('handle', () => {
    it('should send a HTTP GET request to the url', async () => {
      const ipcSenderSpy = { send: sinon.spy() };

      const httpStub = { get: sinon.stub().resolves({ data: 'data' }) };

      const handler = new Handler(httpStub);
      const url = 'https://a.nice.url1';
      const authType = Auth.none;
      const authParams = {};
      await handler.handle({ sender: ipcSenderSpy }, { url, authType, authParams });

      expect(httpStub.get.called).to.equal(true);
      const actualUrl = httpStub.get.lastCall.args[0];
      const requestOptions = httpStub.get.lastCall.args[1];
      expect(actualUrl).to.eql(url);
      expect(requestOptions).to.eql({ headers: {} });
    });

    it('should send a wsse signed HTTP GET request to the url', async () => {
      const ipcSenderSpy = { send: sinon.spy() };

      const httpStub = { get: sinon.stub().resolves({ data: 'data' }) };

      const handler = new Handler(httpStub);
      const url = 'https://a.nice.url1';
      const authType = Auth.wsse;
      const authParams = { key: 'superkey', secret: 'supersecret' };
      await handler.handle({ sender: ipcSenderSpy }, { url, authType, authParams });

      expect(httpStub.get.called).to.equal(true);
      const actualUrl = httpStub.get.lastCall.args[0];
      const requestOptions = httpStub.get.lastCall.args[1];
      expect(actualUrl).to.eql(url);
      expect(requestOptions).to.have.property('headers');
      expect(requestOptions.headers).to.have.property('x-wsse');
    });

    it('should respond with the HTTP response body', async () => {
      const ipcSenderSpy = { send: sinon.spy() };

      const httpResponse = { data: 'response body' };
      const httpStub = { get: sinon.stub().resolves(httpResponse) };

      const handler = new Handler(httpStub);
      const url = 'https://a.nice.url2';
      await handler.handle({ sender: ipcSenderSpy }, { url });

      expect(ipcSenderSpy.send.calledWith('receive-response', { body: httpResponse.data })).to.eql(true);
    });
  });
});
