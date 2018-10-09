import Auth from '../../../../../src/common/auth-types';
import createSigner from '../../../../../src/main/signer/signer-factory';

describe('createSigner', () => {
  describe('should return a function which returns the headers containing the signature', () => {
    it('for no auth', () => {
      const authType = Auth.none;
      const authParams = {};

      const headers = createSigner(authType)(authParams);
      expect(headers).to.eql({});
    });

    it('for wsse auth', () => {
      const authType = Auth.wsse;
      const authParams = { key: 'superkey', secret: 'supersecret' };

      const headers = createSigner(authType)(authParams);
      expect(headers).to.have.property('x-wsse');
    });
  });
});
