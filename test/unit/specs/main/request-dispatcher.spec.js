import sinon from 'sinon';
import nock from 'nock';
import RequestDispatcher from '../../../../src/main/request-dispatcher';
import Auth from '../../../../src/common/auth-types';
const packageInfo = require('../../../../package');

describe('RequestDispatcher', () => {
  describe('.handle', () => {
    it('should route the request through its lifecycle', async () => {
      const clock = sinon.useFakeTimers();

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

      clock.restore();
      sinon.restore();
    });

    const authParams = {
      [Auth.WSSE]: {
        key: 'some_key',
        secret: '53cr3tp455w0rd'
      },
      [Auth.ESCHER]: {
        key: 'some_key',
        secret: '53cr3t',
        credentialScope: 'a/b/c'
      }
    };

    Object.values(Auth).forEach(authType => {
      context(`when auth is '${authType}'`, () => {
        it('should send request body and headers', async () => {
          nock('https://my-service')
            .post('/echo')
            .reply(function(url, requestBody) {
              const requestHeaders = this.req.headers;
              const responseBody = {
                requestHeaders,
                requestBody
              };

              return [200, JSON.stringify(responseBody), { 'content-type': 'application/json' }];
            });

          const ipcRequest = {
            requestDetails: {
              method: 'POST',
              headers: [{ name: 'x-custom-header', value: '123456' }],
              url: 'https://my-service/echo',
              body: '{"echo":true}'
            },
            authType,
            authParams: authParams[authType]
          };

          const event = await RequestDispatcher.handle(ipcRequest);
          const responseBody = JSON.parse(event.response.body);

          expect(responseBody.requestBody).to.equal('{"echo":true}');
          expect(responseBody.requestHeaders).to.include({
            'x-custom-header': '123456'
          });
        });
      });
    });
  });
});
