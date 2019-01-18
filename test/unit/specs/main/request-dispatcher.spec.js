import sinon from 'sinon';
import nock from 'nock';
import RequestDispatcher from '../../../../src/main/request-dispatcher';
import Auth from '../../../../src/common/auth-types';
const packageInfo = require('../../../../package');

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
      nock('https://example.com')
        .get('/')
        .reply(200, {});

      const ipcRequest = {
        requestDetails: {
          method: 'GET',
          headers: [{ name: 'content-type', value: 'application/json' }],
          url: 'https://example.com',
          body: '{}'
        },
        authType: Auth.NONE,
        authParams: {}
      };

      expect(await RequestDispatcher.handle(ipcRequest)).to.eql({
        response: {
          headers: { 'content-type': 'application/json' },
          body: '{}',
          status: 200,
          elapsedTime: 0
        },
        requestHeaders: {
          'user-agent': `RequestRocket/${packageInfo.version}`,
          'content-type': 'application/json',
          'content-length': 2
        }
      });
    });
  });
});
