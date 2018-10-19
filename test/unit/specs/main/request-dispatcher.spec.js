import sinon from 'sinon';
import axios from 'axios';
import RequestDispatcher from '../../../../src/main/request-dispatcher';
import Auth from '../../../../src/common/auth-types';

describe('RequestDispatcher', () => {
  describe('.handle', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      sinon.restore();
      clock.restore();
    });

    it('should route the request through its lifecycle', async () => {
      const ipcRequest = {
        method: 'GET',
        headers: [{ name: 'content-type', value: 'application/json' }],
        url: 'https://example.com',
        body: '',
        authType: Auth.WSSE,
        authParams: { key: 'somekey001', secret: '53cr3t' }
      };

      const axiosRequest = sinon.stub(axios.Axios.prototype, 'request');
      axiosRequest.resolves({
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
          status: 200,
          elapsedTime: 0
        },
        requestHeaders: { 'user-agent': 'some-user-agent' }
      });
    });
  });
});
