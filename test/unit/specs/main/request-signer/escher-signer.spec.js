import Escher from 'escher-auth';
import EscherSigner from '../../../../../src/main/request-signer/escher-signer';

describe('EscherSigner', () => {
  describe('#signRequest', () => {
    it('should not alter the original request headers', () => {
      const signer = new EscherSigner({
        key: 'some_key',
        secret: '53cr3t',
        credentialScope: 'a/b/c'
      });

      const request = { method: 'GET', url: 'http://some.url', headers: {} };
      signer.signRequest(request);
      expect(request.headers).to.eql({});
    });

    it('should add host header to request headers', () => {
      const signer = new EscherSigner({
        key: 'some_key',
        secret: '53cr3t',
        credentialScope: 'a/b/c'
      });

      const request = { method: 'GET', url: 'https://some.url:443', headers: {} };
      const signedRequest = signer.signRequest(request);

      expect(signedRequest.headers.host).to.eql('some.url');
    });

    it('should not alter the host header if its already present', () => {
      const signer = new EscherSigner({
        key: 'some_key',
        secret: '53cr3t',
        credentialScope: 'a/b/c'
      });

      const request = { method: 'GET', url: 'https://some.url:443', headers: { host: 'alma.fa' } };
      const signedRequest = signer.signRequest(request);

      expect(signedRequest.headers.host).to.eql('alma.fa');
    });

    it('should generate valid signature', () => {
      const authParams = {
        vendorKey: 'EMS',
        algoPrefix: 'EMS',
        hashAlgo: 'SHA256',
        authHeaderName: 'X-EMS-Auth',
        dateHeaderName: 'X-EMS-Date',
        accessKeyId: 'secret-service_key_v1',
        apiSecret: 'v3ry53cr3t',
        credentialScope: 'eu/secret-service/ems_request'
      };

      const keyDB = key => {
        if (key === authParams.accessKeyId) {
          return authParams.apiSecret;
        }

        throw new Error('Wrong Escher key');
      };

      const request = {
        method: 'GET',
        url: 'https://some.url:443/q/w/e?q=search_term#qwe',
        headers: {}
      };

      const signer = new EscherSigner({
        key: authParams.accessKeyId,
        secret: authParams.apiSecret,
        credentialScope: authParams.credentialScope
      });

      const signedRequest = signer.signRequest(request);
      signedRequest.url = '/q/w/e?q=search_term';

      signedRequest.headers = [
        ['host', signedRequest.headers.host],
        ['x-ems-auth', signedRequest.headers['x-ems-auth']],
        ['x-ems-date', signedRequest.headers['x-ems-date']]
      ];

      const escher = new Escher(authParams);
      const authKey = escher.authenticate(signedRequest, keyDB);

      expect(authKey).to.eql('secret-service_key_v1');
    });

    it('should be able to sign requests with body', () => {
      const authParams = {
        vendorKey: 'EMS',
        algoPrefix: 'EMS',
        hashAlgo: 'SHA256',
        authHeaderName: 'X-EMS-Auth',
        dateHeaderName: 'X-EMS-Date',
        accessKeyId: 'secret-service_key_v1',
        apiSecret: 'v3ry53cr3t',
        credentialScope: 'eu/secret-service/ems_request'
      };

      const keyDB = key => {
        if (key === authParams.accessKeyId) {
          return authParams.apiSecret;
        }

        throw new Error('Wrong Escher key');
      };

      const request = {
        method: 'POST',
        url: 'https://some.url:443/q/w/e?q=search_term#qwe',
        headers: {},
        data: 'some request data'
      };

      const signer = new EscherSigner({
        key: authParams.accessKeyId,
        secret: authParams.apiSecret,
        credentialScope: authParams.credentialScope
      });

      const signedRequest = signer.signRequest(request);

      signedRequest.url = '/q/w/e?q=search_term';
      signedRequest.body = signedRequest.data;

      delete signedRequest.data;

      signedRequest.headers = [
        ['host', signedRequest.headers.host],
        ['x-ems-auth', signedRequest.headers['x-ems-auth']],
        ['x-ems-date', signedRequest.headers['x-ems-date']]
      ];

      const escher = new Escher(authParams);
      const authKey = escher.authenticate(signedRequest, keyDB);

      expect(authKey).to.eql('secret-service_key_v1');
    });

    context('when X-Suite-CustomerId header is present', () => {
      it('should be signed', () => {
        const authParams = {
          vendorKey: 'EMS',
          algoPrefix: 'EMS',
          hashAlgo: 'SHA256',
          authHeaderName: 'X-EMS-Auth',
          dateHeaderName: 'X-EMS-Date',
          accessKeyId: 'secret-service_key_v1',
          apiSecret: 'v3ry53cr3t',
          credentialScope: 'eu/secret-service/ems_request'
        };

        const keyDB = key => {
          if (key === authParams.accessKeyId) {
            return authParams.apiSecret;
          }

          throw new Error('Wrong Escher key');
        };

        const request = {
          method: 'POST',
          url: 'https://some.url:443/q/w/e?q=search_term#qwe',
          headers: { 'x-suite-customerid': '112233' },
          data: 'some request data'
        };

        const signer = new EscherSigner({
          key: authParams.accessKeyId,
          secret: authParams.apiSecret,
          credentialScope: authParams.credentialScope
        });

        const signedRequest = signer.signRequest(request);

        signedRequest.url = '/q/w/e?q=search_term';
        signedRequest.body = signedRequest.data;

        delete signedRequest.data;

        signedRequest.headers = [
          ['host', signedRequest.headers.host],
          ['x-ems-auth', signedRequest.headers['x-ems-auth']],
          ['x-ems-date', signedRequest.headers['x-ems-date']],
          ['x-suite-customerid', signedRequest.headers['x-suite-customerid']]
        ];

        const escher = new Escher(authParams);
        const authKey = escher.authenticate(signedRequest, keyDB, ['host', 'x-ems-date', 'x-suite-customerid']);

        expect(authKey).to.eql('secret-service_key_v1');
      });
    });
  });
});
