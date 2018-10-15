import sinon from 'sinon';
import axios from 'axios';
import RequestDispatcher from '../../../../src/main/request-dispatcher';

describe('RequestDispatcher', () => {
  describe('.handle', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should route the request through its lifecycle', async () => {
      const ipcRequest = {
        method: 'GET',
        headers: [{ name: 'content-type', value: 'application/json' }],
        url: 'https://example.com',
        body: '',
        authType: 'wsse',
        authParams: { key: 'somekey001', secret: '53cr3t' }
      };

      const axiosStub = sinon.stub();
      sinon.stub(axios, 'create').returns(axiosStub);
      axiosStub.resolves({
        headers: { 'content-type': 'application/json' },
        data: '{}',
        status: 200,
        request: {
          getHeaders() {
            return { 'user-agent': 'some-user-agent' };
          }
        }
      });

      expect(await RequestDispatcher.handle(ipcRequest)).to.eql({
        response: {
          headers: { 'content-type': 'application/json' },
          body: '{}',
          status: 200
        },
        requestHeaders: { 'user-agent': 'some-user-agent' }
      });
    });
  });
});
