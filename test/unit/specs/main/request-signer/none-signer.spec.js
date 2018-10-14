import NoneSigner from '../../../../../src/main/request-signer/none-signer';

describe('NoneSigner', () => {
  describe('#signRequest', () => {
    it('should leave the request untouched', () => {
      const signer = new NoneSigner();
      const request = {
        headers: { 'x-some-header': 'some value' },
        url: 'https://example.com'
      };

      expect(signer.signRequest(request)).to.eql(request);
    });
  });
});
