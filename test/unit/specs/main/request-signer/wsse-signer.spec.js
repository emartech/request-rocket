import CryptoJS from 'crypto-js';
import WsseSigner from '../../../../../src/main/request-signer/wsse-signer';

describe('WsseSigner', () => {
  describe('#signRequest', () => {
    it('should append the X-WSSE header to the request', () => {
      const signer = new WsseSigner({ key: 'some_key001', secret: '53cr3tp455w0rd' });
      const signedRequest = signer.signRequest({
        headers: { 'x-some-header': 'some value' }
      });
      expect(signedRequest.headers).to.have.property('x-wsse');
    });
    it('should produce a header with the proper format', () => {
      const signer = new WsseSigner({ key: 'some_key001', secret: '53cr3tp455w0rd' });
      const signedRequest = signer.signRequest({
        headers: { 'x-some-header': 'some value' }
      });

      expect(signedRequest.headers['x-wsse']).to.have.match(
        /UsernameToken Username=".+", PasswordDigest=".+", Nonce=".+", Created=".+"/
      );
    });
    it('should contain the name of the key being used', () => {
      const signer = new WsseSigner({ key: 'some_key001', secret: '53cr3tp455w0rd' });
      const signedRequest = signer.signRequest({
        headers: { 'x-some-header': 'some value' }
      });

      expect(signedRequest.headers['x-wsse']).to.have.match(/Username="some_key001"/);
    });
    it('should contain the ISO formatted time', () => {
      const signer = new WsseSigner({ key: 'some_key001', secret: '53cr3tp455w0rd' });
      const signedRequest = signer.signRequest({
        headers: { 'x-some-header': 'some value' }
      });

      expect(signedRequest.headers['x-wsse']).to.have.match(/Created="\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z"/);
    });
    it('should generate random nonces', () => {
      const signer = new WsseSigner({ key: 'some_key001', secret: '53cr3tp455w0rd' });
      const firstRequest = signer.signRequest({
        headers: { 'x-some-header': 'some value' }
      });
      const secondRequest = signer.signRequest({
        headers: { 'x-some-header': 'some value' }
      });

      const matcher = /Nonce="([^"]+)"/;

      const firstNonce = matcher.exec(firstRequest.headers['x-wsse'])[1];
      const secondNonce = matcher.exec(secondRequest.headers['x-wsse'])[1];

      expect(firstNonce).not.to.eql(secondNonce);
    });
    it('should calculate proper digest', () => {
      const signer = new WsseSigner({ key: 'some_key001', secret: '53cr3tp455w0rd' });
      const request = signer.signRequest({
        headers: { 'x-some-header': 'some value' }
      });

      const header = request.headers['x-wsse'];

      const nonce = /Nonce="([^"]+)"/.exec(header)[1];
      const created = /Created="([^"]+)"/.exec(header)[1];
      const b64EncodedDigest = /PasswordDigest="([^"]+)"/.exec(header)[1];

      const expectedDigest = CryptoJS.SHA1(`${nonce}${created}53cr3tp455w0rd`).toString(CryptoJS.enc.Hex);

      expect(Buffer.from(b64EncodedDigest, 'base64').toString('utf-8')).to.eql(expectedDigest);
    });
  });
});
