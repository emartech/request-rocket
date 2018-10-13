import sinon from 'sinon';
import Handler from '../../../../src/main/send-request-handler';
import HttpMethod from '../../../../src/common/method-types';
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
      const httpStub = sinon.stub().resolves(httpResponse);
      const handler = new Handler(httpStub);

      const response = await handler.sendHttpRequest({ url: 'https://a.nice.url1', headers: {} });
      expect(response).to.eql(httpResponse);
    });

    it('should send the prepared request', async () => {
      const httpResponse = { data: 'data' };
      const httpStub = sinon.stub().resolves(httpResponse);

      const handler = new Handler(httpStub);

      await handler.sendHttpRequest({ url: 'https://a.nice.url1', headers: { 'x-wsse': 'signature' } });

      expect(httpStub).to.be.calledWithExactly({
        method: HttpMethod.GET,
        url: 'https://a.nice.url1',
        headers: { 'x-wsse': 'signature' }
      });
    });

    describe('when the server responded with an error', () => {
      it('should return error response', async () => {
        const httpResponse = {
          data: 'error response',
          headers: {
            connection: 'close'
          }
        };

        const httpStub = sinon.stub().rejects({ response: httpResponse });

        const handler = new Handler(httpStub);
        const response = await handler.sendHttpRequest({
          url: 'https://a.nice.url2',
          headers: { 'x-wsse': 'signature' }
        });

        expect(response).to.eql(httpResponse);
      });
    });

    describe('when unexpected error occurred', () => {
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

    describe('when timeout exceeded', () => {
      it('should throw error', async () => {
        const errorResponse = { code: 'ECONNABORTED', message: 'timeout of 60000ms exceeded' };
        const httpStub = sinon.stub().rejects(errorResponse);

        const handler = new Handler(httpStub);
        const url = 'https://a.nice.url2';
        const headers = { 'x-wsse': 'signature' };
        try {
          await handler.sendHttpRequest({ url, headers });
        } catch (error) {
          expect(error.message).to.eql('timeout of 60000ms exceeded');
        }
      });
    });
  });

  describe('handle', () => {
    it('should send a HTTP GET request to the url', async () => {
      const ipcSenderSpy = { send: sinon.spy() };

      const response = { data: 'data', request: { getHeaders: () => ({}) } };
      const httpStub = sinon.stub().resolves(response);

      const handler = new Handler(httpStub);
      const url = 'https://a.nice.url1';
      const authType = Auth.none;
      const authParams = {};
      await handler.handle({ sender: ipcSenderSpy }, { url, authType, authParams });

      expect(httpStub).to.be.calledWithExactly({ method: HttpMethod.GET, url, headers: {} });
    });

    it('should send a wsse signed HTTP GET request to the url', async () => {
      const ipcSenderSpy = { send: sinon.spy() };

      const response = { data: 'data', request: { getHeaders: () => ({}) } };
      const httpStub = sinon.stub().resolves(response);

      const handler = new Handler(httpStub);
      const url = 'https://a.nice.url1';
      const authType = Auth.wsse;
      const authParams = { key: 'superkey', secret: 'supersecret' };
      await handler.handle({ sender: ipcSenderSpy }, { url, authType, authParams });

      expect(httpStub.called).to.equal(true);
      const requestOptions = httpStub.lastCall.args[0];
      expect(requestOptions).to.have.property('method');
      expect(requestOptions.method).to.eql(HttpMethod.GET);
      expect(requestOptions).to.have.property('url');
      expect(requestOptions.url).to.eql(url);
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

      const httpStub = sinon.stub().resolves(httpResponse);

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
