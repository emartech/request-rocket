import sinon from 'sinon';
import Handler from '../../../../src/main/send-request-handler';
import Auth from '../../../../src/common/auth-types';

describe('SendRequestHandler', () => {
  describe('createIpcResponse', () => {
    it('should create an internal response representation', () => {
      const httpResponse = {
        data: 'response body',
        headers: {
          connection: 'close'
        },
        status: 200,
        request: {
          getHeaders() {
            return { 'x-some-header': 'some_value' };
          }
        }
      };

      const expectedResponse = {
        response: {
          body: httpResponse.data,
          headers: httpResponse.headers,
          status: 200
        },
        requestHeaders: {
          'x-some-header': 'some_value'
        }
      };

      const actualResponse = Handler.createIpcResponse(httpResponse);
      expect(actualResponse).to.eql(expectedResponse);
    });
  });

  describe('createHttpRequest', () => {
    it('should return all the information needed to send the request', () => {
      const url = 'http://anything.io';
      const authType = Auth.wsse;
      const authParams = { key: 'superkey', secret: 'supersecret' };

      const request = Handler.createHttpRequest({ url, authType, authParams });
      expect(request).to.include({ url });
      expect(request).to.have.property('headers');
      expect(request.headers).to.have.property('x-wsse');
    });
  });

  describe('sendHttpRequest', () => {
    it('should return the http response', async () => {
      const httpResponse = { data: 'data' };
      const httpStub = { get: sinon.stub().resolves(httpResponse) };
      const handler = new Handler(httpStub);

      const url = 'https://a.nice.url1';
      const headers = {};

      const response = await handler.sendHttpRequest({ url, headers });
      expect(response).to.eql(httpResponse);
    });

    it('should send the prepared request', () => {
      const httpResponse = { data: 'data' };
      const httpStub = { get: sinon.stub().resolves(httpResponse) };

      const handler = new Handler(httpStub);
      const url = 'https://a.nice.url1';

      const headers = { 'x-wsse': 'signature' };
      handler.sendHttpRequest({ url, headers });

      expect(httpStub.get).to.be.calledWithExactly(url, { headers });
    });

    describe('when the server responded with an error', () => {
      it('should return error response', async () => {
        const httpResponse = {
          data: 'error response',
          headers: {
            connection: 'close'
          }
        };
        const errorResponse = { response: httpResponse };
        const httpStub = { get: sinon.stub().rejects(errorResponse) };

        const handler = new Handler(httpStub);
        const url = 'https://a.nice.url2';
        const headers = { 'x-wsse': 'signature' };

        const response = await handler.sendHttpRequest({ url, headers });

        expect(response).to.eql(httpResponse);
      });
    });

    describe('when no response was received', () => {
      it('should throw error', async () => {
        const errorResponse = { message: 'unexpected error' };
        const httpStub = { get: sinon.stub().rejects(errorResponse) };

        const handler = new Handler(httpStub);
        const url = 'https://a.nice.url2';
        const headers = { 'x-wsse': 'signature' };
        try {
          await handler.sendHttpRequest({ url, headers });
        } catch (error) {
          expect(error.message).to.eql('Unexpected error occurred.');
        }
      });
    });
  });

  describe('handle', () => {
    it('should send a HTTP GET request to the url', async () => {
      const ipcSenderSpy = { send: sinon.spy() };

      const response = { data: 'data', request: { getHeaders: () => ({}) } };
      const httpStub = { get: sinon.stub().resolves(response) };

      const handler = new Handler(httpStub);
      const url = 'https://a.nice.url1';
      const authType = Auth.none;
      const authParams = {};
      await handler.handle({ sender: ipcSenderSpy }, { url, authType, authParams });

      expect(httpStub.get).to.be.calledWithExactly(url, { headers: {} });
    });

    it('should send a wsse signed HTTP GET request to the url', async () => {
      const ipcSenderSpy = { send: sinon.spy() };

      const response = { data: 'data', request: { getHeaders: () => ({}) } };
      const httpStub = { get: sinon.stub().resolves(response) };

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

      const httpResponse = {
        data: 'response body',
        headers: {
          connection: 'close'
        },
        status: 200,
        request: { getHeaders: () => ({}) }
      };

      const httpStub = { get: sinon.stub().resolves(httpResponse) };

      const handler = new Handler(httpStub);
      await handler.handle({ sender: ipcSenderSpy }, { url: 'https://a.nice.url2' });

      const expectedResponse = {
        response: {
          body: httpResponse.data,
          headers: httpResponse.headers,
          status: httpResponse.status
        },
        requestHeaders: {}
      };

      expect(ipcSenderSpy.send).to.be.calledWithExactly('receive-response', expectedResponse);
    });
  });
});
