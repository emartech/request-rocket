import sinon from 'sinon';
import Handler from '../../../../src/main/send-request-handler';

describe('SendRequestHandler', () => {
  describe('createIpcResponse', () => {
    const httpResponse = { data: 'response body' };

    const expectedResponse = { body: httpResponse.data };

    const actualResponse = Handler.createIpcResponse(httpResponse);
    expect(actualResponse).to.eql(expectedResponse);
  });

  describe('handle', () => {
    it('should send a HTTP GET request to the url', async () => {
      const ipcSenderSpy = { send: sinon.spy() };

      const httpStub = { get: sinon.stub().resolves({ data: 'data' }) };

      const handler = new Handler(httpStub);
      const url = 'https://a.nice.url1';
      await handler.handle({ sender: ipcSenderSpy }, { url });

      expect(httpStub.get.calledWith(url)).to.eql(true);
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
