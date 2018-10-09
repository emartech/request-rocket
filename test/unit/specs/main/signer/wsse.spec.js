import CryptoJS from 'crypto-js';
import WsseSigner from '../../../../../src/main/signer/wsse';

describe('WsseSigner', () => {
  describe('createNonce', () => {
    it('should create a 32 character long string', () => {
      const signer = new WsseSigner(CryptoJS);
      const nonce = signer.createNonce();
      expect(nonce).to.have.lengthOf(32);
    });

    it('should create a new random nonce every time', () => {
      const signer = new WsseSigner(CryptoJS);
      const nonce = signer.createNonce();
      const nonce2 = signer.createNonce();
      expect(nonce2).to.not.eql(nonce);
    });
  });

  describe('createTimestamp', () => {
    it('should create an iso timestamp', () => {
      const timestamp = WsseSigner.createTimestamp();
      const regex = new RegExp('^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}');
      expect(timestamp).to.match(regex);
    });
  });

  describe('createDigest', () => {
    it('should return a base64 encoded string', () => {
      const nonce = 'supernonce';
      const timestamp = new Date().toISOString();
      const secret = 'supersecret';
      const base64Regex = new RegExp('^(?:[\\w+/]{4})*(?:[\\w+/]{2}==|[\\w+/]{3}=)?$', 'i');

      const signer = new WsseSigner(CryptoJS);
      const digest = signer.createDigest(nonce, timestamp, secret);
      expect(digest).to.match(base64Regex);
    });

    it('should create the same digest when called with the same parameters', () => {
      const nonce = 'supernonce';
      const timestamp = '2018-10-09T12:22:27.166Z';
      const secret = 'supersecret';

      const signer = new WsseSigner(CryptoJS);
      const digest = signer.createDigest(nonce, timestamp, secret);
      const digest2 = signer.createDigest(nonce, timestamp, secret);

      expect(digest2).to.equal(digest);
      expect(digest).to.equal('OTEzMGI3N2JhMmU2MjYwOTIwOTc2N2EzYzY0OWU3MDVjYTU3YmYyOA==');
    });
  });

  describe('getHeader', () => {
    it('should create a header from the key, nonce, timestamp and the digest', () => {
      const key = 'superkey';
      const nonce = 'supernonce';
      const timestamp = '2018-10-09T12:22:27.166Z';
      const digest = 'OTEzMGI3N2JhMmU2MjYwOTIwOTc2N2EzYzY0OWU3MDVjYTU3YmYyOA==';
      const expectedHeaderValue = `UsernameToken Username="${key}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;

      const header = WsseSigner.getHeader(key, digest, nonce, timestamp);

      expect(header).to.include({ 'x-wsse': expectedHeaderValue });
    });
  });
});
