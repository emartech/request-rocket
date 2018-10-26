import EscherSigner from '../../../../../src/main/request-signer/escher-signer';

describe('EscherSigner', () => {
  describe('#signRequest', () => {
    it('should not alter the original request headers', () => {
      const signer = new EscherSigner();
      const request = { method: 'GET', url: 'http://some.url', headers: {} };
      signer.signRequest(request);
      expect(request.headers).to.eql({});
    });

    it('should add host header to request headers', () => {
      const signer = new EscherSigner();
      const request = { method: 'GET', url: 'https://some.url:443', headers: {} };
      const signedRequest = signer.signRequest(request);
      expect(signedRequest.headers.host).to.eql('some.url');
    });

    it('should not alter the host header if its already present', () => {
      const signer = new EscherSigner();
      const request = { method: 'GET', url: 'https://some.url:443', headers: { host: 'alma.fa' } };
      const signedRequest = signer.signRequest(request);
      expect(signedRequest.headers.host).to.eql('alma.fa');
    });
  });
});
